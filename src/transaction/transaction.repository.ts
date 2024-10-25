import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, InsertManyOptions, ClientSession, FilterQuery } from 'mongoose';
import { ITransaction } from './dto/transaction.interface';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectModel('Transaction') private readonly transactionModel: Model<ITransaction>,
  ) { }

  async create(transactions: ITransaction[], options?: InsertManyOptions, session?: ClientSession): Promise<ITransaction[]> {
    try {
      const newTransactions = await this.transactionModel.insertMany(transactions, { ...(options || {}), session });
      return newTransactions;
    } catch (error) {
      throw new HttpException('Failed to insert transactions', 500);
    }
  }

  async startTransaction(): Promise<ClientSession> {
    try {
      const session = await this.transactionModel.startSession();
      session.startTransaction();
      return session;
    } catch (error) {
      throw new Error('Failed to start transaction');
    }
  }

  async commitTransaction(session: ClientSession): Promise<void> {
    try {
      await session.commitTransaction();
      await session.endSession();
    } catch (error) {
      await this.abortTransaction(session);
      throw new Error('Failed to commit transaction');
    }
  }

  async abortTransaction(session: ClientSession): Promise<void> {
    try {
      await session.abortTransaction();
      await session.endSession();
    } catch (error) {
      throw new Error('Failed to abort transaction');
    }
  }

  async find(filter: FilterQuery<ITransaction>): Promise<ITransaction[]> {
    return this.transactionModel.find(filter).exec();
  }

  async findById(id: Types.ObjectId): Promise<any> {
    return this.transactionModel.findById(id).exec();
  }
}
