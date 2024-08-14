import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUser } from 'src/types/types';

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
    });
    return this.updateToken({name:user.name,email:user.email,id:user.id.toString(),phone:user.phone,urlToImg:user.urlToImg});
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

	private updateToken(user:IUser){
		const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      name: user.name,
			phone:user.phone,
			urlToImg:user.urlToImg,
    });
		
    return { ...user, token };
	}

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
			where:{id: userId}
		})
		const isEmailExists = await this.userRepository.findOne({
			where:{
				email:updateUserDto.email,
				id:Not(userId)
			}
		})
		if (isEmailExists) throw new BadRequestException('This email already exists')
		const isPhoneExists = await this.userRepository.findOne({
			where:{
				phone:updateUserDto.phone,
				id:Not(userId)
			}
		})
		if (isPhoneExists) throw new BadRequestException('This phone already exists')
		if (!user) throw new NotFoundException('User not found')
			let result = {
				id:userId.toString(),
				name:updateUserDto.name,
				email:updateUserDto.email,
				phone:updateUserDto.phone,
				urlToImg:updateUserDto.urlToImg,
			}
		const {id,...resultWOId} = result
		if (updateUserDto.oldPassword){
			const isOldPasswordCorrect = await argon2.verify(user.password,updateUserDto.oldPassword)
			if (!isOldPasswordCorrect) throw new BadRequestException('You should enter correctly your old password')
			if (updateUserDto.newPassword!==updateUserDto.repeatedNewPassword) throw new BadRequestException('New password doesnt match')
			if(updateUserDto.newPassword.length<6) throw new BadRequestException('Password must be at least 6 symbols')
			const encryptedPassword = await argon2.hash(updateUserDto.newPassword)
			
			await this.userRepository.update(userId,{...resultWOId,password:encryptedPassword})
			return this.updateToken(result)
		}
		
		await this.userRepository.update(userId,resultWOId)
		return this.updateToken(result)
	}

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
