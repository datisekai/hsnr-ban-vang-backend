import _ = require('lodash');
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMetaDto, UpdateMetaDto } from './meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from './meta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}

  async create(create_dto: CreateMetaDto) {
    const existed = await this.metaRepository.findOne({
      where: { meta_key: create_dto.meta_key },
    });
    if (existed) {
      throw new BadRequestException('Meta already existed');
    }
    const data = this.metaRepository.create(create_dto);
    return this.metaRepository.save(data);
  }

  async update(meta_key: string, update_dto: UpdateMetaDto) {
    const existed = await this.metaRepository.findOne({ where: { meta_key } });
    if (!existed) {
      console.log('----not existed');
      const data = this.metaRepository.create(update_dto);
      return this.metaRepository.save(data);
    }
    const { meta_value } = update_dto;
    existed.meta_value = meta_value || existed.meta_value;

    console.log('----existed', existed);
    return this.metaRepository.save(existed);
  }

  async delete(meta_key: string) {
    const meta = await this.get(meta_key);
    await this.metaRepository.remove(meta);
    return true;
  }

  async get(meta_key: string) {
    const meta = await this.metaRepository.findOne({ where: { meta_key } });
    if (!meta) {
      throw new NotFoundException(`meta`);
    }
    return meta;
  }
}
