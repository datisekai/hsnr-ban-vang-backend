import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';
import { AppResource, AppRoles } from 'src/app.role';
import { User as UserEntity } from '../user/user.entity';
import { OrderService } from './order.service';
import { ConfirmOrderDto, CreateOrderDto } from './order.dto';
import { ObjectId } from 'typeorm';

@ApiTags(AppResource.ORDER)
@Controller('api.order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get List Order',
  })
  async getMany(@Query() query) {
    return await this.orderService.getMany(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Order',
  })
  async createOne(@Body() dto: CreateOrderDto) {
    const data = await this.orderService.createOne(dto);
    return { message: 'Order created', data };
  }

  @Auth({
    action: 'delete',
    possession: 'own',
    resource: AppResource.ORDER,
  })
  @Delete(':id')
  @ApiOperation({
    summary: 'Soft Delete Order',
  })
  async deleteOne(@Param('id') id: ObjectId) {
    let data;

    data = await this.orderService.deleteOne(id);
    return { message: 'Order deleted', data };
  }
}
