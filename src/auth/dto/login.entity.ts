import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class loginData {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
    password: string;
}