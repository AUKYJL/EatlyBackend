import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: createUserDto.email }, { phone: createUserDto.phone }],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new BadRequestException('This email already exists');
      } else {
        throw new BadRequestException('This phone already exists');
      }
    }
    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      password: await argon2.hash(createUserDto.password),
      phone: createUserDto.phone,
      //   bookmarkedRestaurants: [],
      //   foodsInCart: [],
      //   purchases: [],
      //   articles: [],
    });
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
    });
    return { user, token };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
