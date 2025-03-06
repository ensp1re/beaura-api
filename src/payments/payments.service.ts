/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISubscription, ITransaction } from '@auth/interfaces/main.interface';
import { UsersService } from '@auth/users/users.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

type PlanType = 'free' | 'plus' | 'pro';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(private usersService: UsersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any
    });
  }

  private readonly PRICE_IDS: { [key in PlanType]: string } = {
    free: 'price_1QxC4MCCcpZMFoiZiX0chYo4',
    plus: 'price_1QxC4hCCcpZMFoiZBRBtepxi',
    pro: 'price_1QxC4zCCcpZMFoiZlRaoGl8y'
  };

  async createCheckoutSession(planType: string, userId: string): Promise<{ sessionId: string; url: string | null }> {
    try {
      const user = await this.usersService.findById(userId as string);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      if (!(planType in this.PRICE_IDS)) {
        throw new BadRequestException('Invalid plan type. Make sure to use one of the following: free, plus, pro');
      }

      let stripeCustomerId = user.stripeCustomerId;

      if (!stripeCustomerId) {
        const { stripeCustomerId: newCustomerId } = await this.createStripeCustomerId(user.email!);
        stripeCustomerId = newCustomerId;

        await this.usersService.updateSubscription(user._id as string, { stripeCustomerId });
      }

      console.log(`Stripe Customer ID: ${stripeCustomerId}`);

      if (!stripeCustomerId || typeof stripeCustomerId !== 'string') {
        throw new BadRequestException('Failed to retrieve or create Stripe Customer ID');
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: this.PRICE_IDS[planType as PlanType],
            quantity: 1
          }
        ],
        success_url: `${process.env.BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
        client_reference_id: (user._id as string).toString(),
        customer: stripeCustomerId,
        metadata: {
          userId: (user._id as string).toString(),
          planType: (planType as string).toString()
        }
      });

      return {
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        this.logger.error(`Error creating checkout session: ${error.message}`);
      } else {
        this.logger.error('Error creating checkout session');
      }
      throw new BadRequestException('Unable to create checkout session');
    }
  }

  async createStripeCustomerId(email: string): Promise<{ stripeCustomerId: string }> {
    try {
      const customer = await this.stripe.customers.create({
        email
      });

      console.log(`Created Stripe Customer ID: ${customer.id}`);

      return {
        stripeCustomerId: customer.id
      };
    } catch (error) {
      this.logger.error(`Error creating Stripe customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new BadRequestException('Unable to create Stripe customer');
    }
  }

  async cancelSubscription(useId: string): Promise<{ message: string }> {
    try {
      const user = await this.usersService.findById(useId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const subscriptions = await this.stripe.subscriptions.list({
        customer: user.stripeCustomerId!,
        status: 'active'
      });

      if (subscriptions.data.length === 0) {
        throw new BadRequestException('No active subscription found');
      }

      const subscription = subscriptions.data[0];
      await this.stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true
      });

      await this.handleSubscriptionCancellation(subscription);

      return {
        message: 'Subscription cancelled successfully'
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error cancelling subscription: ${error.message}`);
      } else {
        this.logger.error('Error cancelling subscription');
      }
      throw new BadRequestException('Unable to cancel subscription');
    }
  }

  async createPortalSession(userId: string): Promise<{ url: string | null }> {
    try {
      const user = await this.usersService.findById(userId as unknown as string);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId!,
        return_url: `${process.env.BASE_URL}/portal`
      });

      return {
        url: session.url
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error creating portal session: ${error.message}`);
      } else {
        this.logger.error('Error creating portal session');
      }
      throw new BadRequestException('Unable to create portal session');
    }
  }


  private async handleSubscriptionChange(subscription: Stripe.Subscription) {
    try {
      const customerId = subscription.customer as string;
      const user = await this.usersService.findBystripeCustomerId(customerId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const plan = subscription.items.data[0].price.metadata.planId;

      if (!plan) {
        throw new BadRequestException('Plan type is undefined');
      }
      const credits = this.getCreditsForPlan(plan as PlanType);

      const subscriptionData: ISubscription = {
        id: subscription.id,
        status: subscription.status,
        planId: subscription.items.data[0].price.id,
        planName: plan,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };

      const updatedSubscriptions = user.subscriptions ? [...user.subscriptions] : [];
      const existingSubIndex = updatedSubscriptions.findIndex((sub) => sub.id === subscription.id);
      if (existingSubIndex !== -1) {
        updatedSubscriptions[existingSubIndex] = subscriptionData;
      } else {
        updatedSubscriptions.push(subscriptionData);
      }

      await this.usersService.updateSubscription(user._id, {
        status: plan.slice(0, 1).toUpperCase() + plan.slice(1),
        creditBalance: credits,
        subscriptions: updatedSubscriptions,
        stripeCustomerId: subscription.customer as string
      });

      this.logger.log(`Subscription updated for user ${user._id}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error handling subscription change: ${error.message}`);
      } else {
        this.logger.error('Error handling subscription change');
      }
    }
  }

  private async handleSubscriptionCancellation(subscription: Stripe.Subscription) {
    try {
      const customerId = subscription.customer as string;
      const user = await this.usersService.findBystripeCustomerId(customerId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Cancel the subscription in Stripe
      await this.stripe.subscriptions.cancel(subscription.id, {
        invoice_now: true
      });

      const updatedSubscriptions = (user.subscriptions ?? []).filter((sub) => sub.id !== subscription.id);

      await this.usersService.updateSubscription(user._id, {
        status: 'free',
        creditBalance: 5,
        subscriptions: updatedSubscriptions
      });

      this.logger.log(`Subscription cancelled for user ${user._id}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error handling subscription cancellation: ${error.message}`);
      } else {
        this.logger.error('Error handling subscription cancellation');
      }
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    try {
      if (!invoice.metadata) {
        throw new BadRequestException('Invoice metadata is null');
      }

      const customerId = invoice.customer as string;
      const user = await this.usersService.findBystripeCustomerId(customerId);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const transaction: ITransaction = {
        id: invoice.id as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status!,
        date: new Date(invoice.created * 1000),
        invoiceId: invoice.id
      };

      const updatedTransactions = user.transactions ? [...user.transactions] : [];

      await this.usersService.updateSubscription(user._id, {
        transactions: [...updatedTransactions, transaction]
      });

      this.logger.log(`Transaction created for user ${user._id}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error handling invoice paid: ${error.message}`);
      } else {
        this.logger.error('Error handling invoice paid');
      }
    }
  }

  async handleWebhookEvent(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);

      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
          break;
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;
      }

      return { received: true };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Webhook Error: ${error.message}`);
      } else {
        this.logger.error('Webhook Error');
      }
      throw new BadRequestException(`Webhook Error: ${(error as Error).message}`);
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    try {
      if (!invoice.metadata) {
        throw new BadRequestException('Invoice metadata is null');
      }
      const customerId = invoice.customer as string;
      const user = await this.usersService.findBystripeCustomerId(customerId);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const transaction: ITransaction = {
        id: invoice.id as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'failed' as string,
        date: new Date(invoice.created * 1000),
        invoiceId: invoice.id
      };

      const updatedTransactions = user.transactions ? [...user.transactions] : [];

      await this.usersService.updateSubscription(user._id, {
        transactions: [...updatedTransactions, transaction]
      });

      this.logger.log(`Invoice payment failed ${user._id}`);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Error handling invoice payment failed: ${error.message}`);
      } else {
        this.logger.error('Error handling invoice payment failed');
      }
    }
  }

  async getInvoicePdf(invoiceId: string): Promise<string> {
    try {
      if (!invoiceId) {
        throw new BadRequestException('Invoice ID is required to retrieve invoice');
      }

      const invoice = await this.stripe.invoices.retrieve(invoiceId);
      return invoice.invoice_pdf ?? '';
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to retrieve invoice: ${error.message}`);
      } else {
        throw new Error('Failed to retrieve invoice: Unknown error');
      }
    }
  }

  private getCreditsForPlan(plan: string): number {
    switch (plan) {
      case 'free':
        return 5;
      case 'plus':
        return 50;
      case 'pro':
        return 100;
      default:
        return 5;
    }
  }

  // private getCustomPriceForPlan(plan: string): number {
  //   switch (plan) {
  //     case 'free':
  //       return 0;
  //     case 'plus':
  //       return 999;
  //     case 'pro':
  //       return 1789;
  //     default:
  //       return 0;
  //   }
  // }
}
