import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MetaController } from './meta.controller';
import { Meta } from './meta.entity';
import { MetaService } from './meta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meta])],
  controllers: [MetaController],
  providers: [MetaService],
  exports: [MetaService],
})
export class MetaModule {}
