import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.role';
import { Auth } from 'src/common/decorators';
import { ObjectId } from 'typeorm';
import { CreateOrderDto } from './order.dto';
import { OrderService } from './order.service';
import { HistoryMbbank } from '../sieuthicode/sieuthicode.service';

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

  @Post('webhooks/callback')
  @ApiOperation({
    summary: 'callback web hooks',
  })
  async callbackWebhook2(@Body() data: any) {
    console.log('callbackWebhook post');
    const histories = data.transactions as HistoryMbbank[];
    this.orderService.handleWebhooks(histories);
    return { success: true };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Detail Order',
  })
  async getOne(@Param('id') id: string) {
    console.log('id', id);
    const data = await this.orderService.getOne(+id);
    return { data };
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
    summary: 'Delete Order',
  })
  async deleteOne(@Param('id') id: string) {
    let data;

    data = await this.orderService.deleteOne(+id);
    return { message: 'Order deleted', data };
  }

  @Post('confirm/:id')
  @ApiOperation({
    summary: 'Confirm Transfer',
  })
  async confirm(@Param('id') id: string) {
    // const data = await this.orderService.confirmTransfer(+id);
    return { message: 'Confirmed', data: {}, success: true };
  }

  @Get('/check/canceled')
  @ApiOperation({
    summary: 'Check Orders',
  })
  async checkOrders() {
    await this.orderService.checkOrders();
    return { success: true };
  }
}
