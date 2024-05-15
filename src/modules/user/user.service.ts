import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeVietnameseDiacritics } from 'src/common/helpers';
import { MongoRepository, Repository } from 'typeorm';
import { CreateUserDto, EditUserDto } from './user.dto';
import { User } from './user.entity';
import { ObjectId } from 'mongodb';

export interface UserFindOne {
  id?: string;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) {}

  async getMany(query: any) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    const where: any = {};

    if (query.fullname) {
      where.fullname_search = new RegExp(
        `.*${query.fullname.toLowerCase()}.*`,
        'i',
      );
    }

    if (query.is_active) {
      where.is_active = query.is_active;
    }

    if (query.email) {
      where.email = query.email;
    }

    const [data, totalEntries] = await this.userRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, totalEntries, page, limit };
  }

  async getOne(id: string, userEntity?: User) {
    const user = await this.userRepository.findOneById(id);

    if (!user)
      throw new NotFoundException('User does not exists or unauthorized');

    return user;
  }

  async createOne(dto: CreateUserDto) {
    const userExist = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (userExist)
      throw new BadRequestException('User already registered with email');

    const newUser = this.userRepository.create({
      email: dto.email,
      roles: dto.roles,
      fullname: dto.fullname,
      is_active: dto.is_active,
      password: dto.password,
      fullname_search: removeVietnameseDiacritics(dto.fullname),
    });
    const user = await this.userRepository.save(newUser);

    delete user.password;
    return user;
  }

  async create(dto: CreateUserDto) {
    const newUser = this.userRepository.create({
      email: dto.email,
      roles: dto.roles,
      fullname: dto.fullname,
      is_active: dto.is_active,
      password: dto.password,
      fullname_search: removeVietnameseDiacritics(dto.fullname),
    });
    const user = await this.userRepository.save(newUser);

    delete user.password;
    return user;
  }

  async editOne(id: string, dto: EditUserDto, userEntity?: User) {
    const user = await this.getOne(id, userEntity);
    user.email = dto.email || user.email;
    if (dto.fullname) {
      user.fullname = dto.fullname;
      user.fullname_search = removeVietnameseDiacritics(
        dto.fullname,
      ).toLocaleLowerCase();
    }

    if (dto.is_active != null) {
      user.is_active = dto.is_active;
    }

    if (dto.password) {
      user.password = dto.password;
    }

    user.roles = dto.roles || user.roles;

    return await this.userRepository.save(user);
  }

  async deleteOne(id: string, userEntity?: User) {
    return await this.userRepository.delete(id);
  }

  async findOne(data: UserFindOne) {
    return await this.userRepository.findOne({
      where: { ...data },
    });
  }
}
