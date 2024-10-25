	import { Model, Types } from 'mongoose';
	import { InjectModel } from '@nestjs/mongoose';
	import { IUser } from './dto/user.interface';
	import { Injectable } from '@nestjs/common';

	@Injectable()
	export class UserRepository {
		constructor(@InjectModel('User') private readonly userModel: Model<IUser>) { }

		async create(user: any): Promise<IUser> {
			const createdUser = new this.userModel(user);
			return await createdUser.save();
		}

		async findAll(): Promise<any[]> {
			return await this.userModel.find({}, '-password').exec();
		}

		async findById(id: Types.ObjectId): Promise<any> {
			return await this.userModel.findById(id, '-password').exec();
		}

		async findOneByEmail(email: string): Promise<any> {
			return await this.userModel.findOne({ email }).lean().exec();
		}
	}