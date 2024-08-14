import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { IUser } from 'src/types/types';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('User or password are incorrect');
    }
    const passwordIsMatch = await argon2.verify(user.password, password);
    if (user && passwordIsMatch) {
      return user;
    }
    throw new UnauthorizedException('User or password are incorrect');
  }

  async login(user: IUser) {
    const { id, email, name,urlToImg, phone } = user;
    return {
      id,
      email,
      name,
			urlToImg,
			phone,
      //кладет в токен инфу
      token: this.jwtService.sign({
        id,
      	email,
        name,
				urlToImg,
				phone
      }),
    };
  }
}
