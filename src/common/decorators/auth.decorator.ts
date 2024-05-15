import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../modules/auth/guards';
import { ACGuard, Role, UseRoles } from 'nest-access-control';

export function Auth(...roles: Role[]) {
  console.log('---auth decorator---', roles);
  return applyDecorators(
    UseGuards(JwtAuthGuard, ACGuard),
    UseRoles(...roles),
    ApiBearerAuth(),
  );
}
