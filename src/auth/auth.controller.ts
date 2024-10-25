import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginData } from './dto/login.entity';
import { Public } from './public.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post()
	@ApiResponse({ status: HttpStatus.OK, description: 'Successful login' }) 
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' }) 
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' }) 
	signIn(@Body() signInDto: loginData) {
		return this.authService.logIn(signInDto);
	}
}
