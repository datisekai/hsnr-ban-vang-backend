import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { FindOneOptions, ObjectId, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto, EditUserDto, UserDto } from './user.dto';
import { removeVietnameseDiacritics } from 'src/common/helpers';

export interface UserFindOne {
  _id?: ObjectId;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMany(query: any) {
    const page = +query.page || 1;
    const limit = +query.limit || 10;

    // .createQueryBuilder('user')
    // .where('user.is_deleted = false')
    // .take(limit)
    // .skip((page - 1) * limit);
    const where: any = { is_deleted: false };

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

  async getOne(_id: ObjectId, userEntity?: User) {
    console.log('getOne');
    const user = await this.userRepository.findOne({
      where: { _id, is_deleted: false },
    });

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
      is_deleted: false,
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

  async editOne(_id: ObjectId, dto: EditUserDto, userEntity?: User) {
    const user = await this.getOne(_id, userEntity);
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

  async deleteOne(_id: ObjectId, userEntity?: User) {
    const removedUser = await this.getOne(_id, userEntity);
    removedUser.is_deleted = true;
    return await this.userRepository.save(removedUser);
  }

  async findOne(data: UserFindOne) {
    return await this.userRepository.findOne({
      where: { ...data, is_deleted: false },
    });
  }
}
