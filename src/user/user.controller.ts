import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser } from "./dto/user.interface";
import { createUserDto } from "./dto/user.entity";
import { Types } from "mongoose";
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "src/auth/auth.guard";

@ApiTags('users')
@Controller('user')
export class UserController {
	constructor(private userService: UserService) { }

	@Post()
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 201, description: 'User created successfully!' })
	@ApiResponse({ status: 400, description: 'Email already exists.' })
	async create(@Body() userData: createUserDto): Promise<{ message: string }> {
		return this.userService.create(userData as IUser);
	}

	@Get()
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'User list retrieved successfully.' })
	@ApiResponse({ status: 404, description: 'No users found.' })
	async findAll(): Promise<IUser[]> {
		return this.userService.list();
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'User found successfully.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	async getById(@Param('id') id: Types.ObjectId): Promise<object> {
		return this.userService.getById(id);
	}
}
