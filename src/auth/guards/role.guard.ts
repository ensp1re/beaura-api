import { Role } from '@auth/interfaces/transformation.interface';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, SetMetadata} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';


export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    console.log('Required roles:', roles);

    if (!roles) {
      return true; // If no roles are defined, allow access
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.currentUser; 

    if (!user) {
        throw new UnauthorizedException('User not found');
    }
    const isValid = user && (user.role) && roles.some((role) => user.role.includes(role));

    if (!isValid) {
      throw new ForbiddenException('You don\'t have permission to access this resource');
    } 

    return isValid;
  }
}

