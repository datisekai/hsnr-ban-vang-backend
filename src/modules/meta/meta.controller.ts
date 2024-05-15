import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import {
  Controller,
  Post,
  Query,
  Body,
  UseGuards,
  Put,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { MetaService } from './meta.service';
import { CreateMetaDto, UpdateManyMetaDto, UpdateMetaDto } from './meta.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppResource } from 'src/app.role';

@Controller('api.meta')
@ApiTags(AppResource.META)
export class MetaController {
  constructor(private readonly metaService: MetaService) {}

  @Post()
  @ApiOperation({ summary: 'Create' })
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: AppResource.META,
    action: 'create',
    possession: 'any',
  })
  async create(@Body() createData: CreateMetaDto) {
    return this.metaService.create(createData);
  }

  @Put(':key')
  @ApiOperation({ summary: 'Update by key' })
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: AppResource.META,
    action: 'update',
    possession: 'any',
  })
  async update(
    @Param('key') meta_key: string,
    @Body() update_dto: UpdateMetaDto,
  ) {
    return this.metaService.update(meta_key, update_dto);
  }

  @Delete(':key')
  @ApiOperation({ summary: 'Delete by key' })
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: AppResource.META,
    action: 'delete',
    possession: 'any',
  })
  async delete(@Param('key') meta_key: string) {
    return this.metaService.delete(meta_key);
  }

  @Get('key/:key')
  @ApiOperation({ summary: 'Get by key' })
  async get(@Param('key') key: string) {
    return this.metaService.get(key);
  }
}
