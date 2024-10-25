import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class createUserDto {
	@ApiProperty({ description: 'Nome do usuário' })
	@IsNotEmpty()
	name: string;

	@ApiProperty({ description: 'Email do usuário', example: 'john.doe@example.com' })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ description: 'Senha do usuário' })
	@IsNotEmpty()
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
		message: 'Password is too weak. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
	})
	password: string;
}