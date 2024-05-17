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
import { UserService } from './user.service';
import { Auth, User } from 'src/common/decorators';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesBuilder, InjectRolesBuilder } from 'nest-access-control';
import { AppResource, AppRoles } from 'src/app.role';
import { User as UserEntity } from './user.entity';
import {
  CreateUserDto,
  EditFcmTokenDto,
  EditUserDto,
  RegisterUserDto,
} from './user.dto';
import { ObjectId } from 'typeorm';

@ApiTags(AppResource.USER)
@Controller('api.user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @InjectRolesBuilder()
    private readonly rolesBuilder: RolesBuilder,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get List User',
    description: 'Query with fullname, is_active, email',
  })
  async getMany(@Query() query) {
    return await this.userService.getMany(query);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register',
  })
  async publicRegistration(@Body() dto: RegisterUserDto) {
    const data = await this.userService.createOne({
      ...dto,
      roles: [AppRoles.FREE],
      is_active: true,
    });
    return { message: 'User registered', data };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get User By ID',
  })
  async getOne(@Param('id') id: string) {
    const data = await this.userService.getOne(id);
    return { data };
  }

  // @Auth({
  //   possession: 'any',
  //   action: 'create',
  //   resource: AppResource.USER,
  // })
  @Post()
  @ApiOperation({
    summary: 'Create User',
  })
  async createOne(@Body() dto: CreateUserDto) {
    console.log('---passed---ƒ', dto);
    const data = await this.userService.createOne(dto);
    return { message: 'User created', data };
  }

  @Auth({
    possession: 'own',
    action: 'update',
    resource: AppResource.USER,
  })
  @ApiOperation({
    summary: 'Edit User',
  })
  @Put(':id')
  async editOne(
    @Param('id') id: string,
    @Body() dto: EditUserDto,
    @User() user: UserEntity,
  ) {
    let data;

    if (this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted) {
      data = await this.userService.editOne(id, dto);
    } else {
      const { roles, ...rest } = dto;
      data = await this.userService.editOne(id, rest, user);
    }
    return { message: 'User edited', data };
  }

  @Auth({
    action: 'delete',
    possession: 'own',
    resource: AppResource.USER,
  })
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete User',
  })
  async deleteOne(@Param('id') id: string, @User() user: UserEntity) {
    let data;

    if (this.rolesBuilder.can(user.roles).updateAny(AppResource.USER).granted) {
      data = await this.userService.deleteOne(id);
    } else {
      data = await this.userService.deleteOne(id, user);
    }
    return { message: 'User deleted', data };
  }
}
