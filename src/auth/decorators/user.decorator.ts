import { User } from '@auth/users/models.schema.ts/users.schema';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    return data ? user?.[data] : user;
  },
);

/*/ example usage
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('username')
  getUsername(@CurrentUser('username') username: string) {
    return `Username: ${username}`;
  }
}
/*/
