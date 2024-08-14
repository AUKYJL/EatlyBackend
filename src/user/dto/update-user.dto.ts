import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

	@IsNotEmpty()
	name:string;

	@IsNotEmpty()
	@IsEmail()
	email:string;

	@IsNotEmpty()
	phone: string;
	
	urlToImg:string;

	oldPassword?:string;

	newPassword?:string;
	
	repeatedNewPassword?:string;

}
