import * as bcrypt from 'bcrypt';
import { BadRequestException, Body, Injectable } from "@nestjs/common";
import { UserRepository } from './user.repository';
import { IUser } from './dto/user.interface';
import { createUserDto } from "./dto/user.entity";
import { Types } from 'mongoose';

@Injectable()
export class UserService {
	constructor(
		private UserRepository: UserRepository
	) { }
	async create(userData: createUserDto): Promise<{ message: string }> {
		try {
			const existingUser = await this.UserRepository.findOneByEmail(userData.email as string);
			if (existingUser) {
				throw new BadRequestException('Email already exists');
			}


			const saltOrRounds = 10;
			userData.password = await bcrypt.hash(userData.password as string, saltOrRounds);

			await this.UserRepository.create(userData as IUser);
			return { message: 'User created successfully!' };
		} catch (error) {
			if (error.name === 'ValidationError') {
				throw new BadRequestException('Validation failed: ' + error.message);
			}
			throw new BadRequestException('Failed to create user: ' + error.message);
		}
	}

	async getById(id: Types.ObjectId): Promise<object> {
		const user = await this.UserRepository.findById(id);

		if (!user) {
			throw new BadRequestException('User not found');
		}

		return user;
	}

	async list(): Promise<IUser[]> {
		return await this.UserRepository.findAll()
	}
}