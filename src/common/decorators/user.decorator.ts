import { createParamDecorator } from '@nestjs/common';

export const CurrentUser = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();

  if (req.user && data) {
    return data ? req.user[data] : req.user;
  }

  if (req.admin && data) {
    return data ? req.admin[data] : req.admin;
  }

  return null;
});
