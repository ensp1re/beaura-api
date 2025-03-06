import { Controller, Post, Body, Headers, Req, UseGuards, Param, HttpCode, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@auth/auth/guards/auth.guard';
import { Request } from 'express';

import { PaymentsService } from './payments.service';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard)
  @Post('create-checkout-session/:userId')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a checkout session' })
  @ApiResponse({ status: 201, description: 'Checkout session created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createCheckoutSession(@Body() body: { planType: string }, @Param('userId') userId: string) {
    return this.paymentsService.createCheckoutSession(body.planType, userId as string);
  }

  @UseGuards(AuthGuard)
  @Post('create-portal-session/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a portal session' })
  @ApiResponse({ status: 200, description: 'Portal session created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createPortalSession(@Param('userId') userId: string) {
    return this.paymentsService.createPortalSession(userId);
  }

  @UseGuards(AuthGuard)
  @Post('cancel-subscription/:userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async cancelSubscription(@Param('userId') userId: string) {
    return this.paymentsService.cancelSubscription(userId);
  }

  @UseGuards(AuthGuard)
  @Get('retrieve-invoice/:invoiceId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Retrieve invoice' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async retrieveInvoice(@Param('invoiceId') invoiceId: string) {
    return this.paymentsService.getInvoicePdf(invoiceId);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle webhook events' })
  @ApiResponse({ status: 200, description: 'Webhook event handled successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() request: Request) {
    return this.paymentsService.handleWebhookEvent(signature, request.body);
  }
}
