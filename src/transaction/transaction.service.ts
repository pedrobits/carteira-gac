import { HttpException, Injectable } from "@nestjs/common";
import { UserRepository } from "src/user/user.repository";
import { TransactionRepository } from './transaction.repository';
import { ITransaction } from "./dto/transaction.interface";
import { Types } from "mongoose";
import { IUser } from "src/user/dto/user.interface";

@Injectable()
export class TransactionService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly transactionRepository: TransactionRepository
	) { }


	async createNewTransaction(senderID: Types.ObjectId, receiverID: Types.ObjectId, amount: number) {
		if (amount <= 0) {
			throw new HttpException('Amount must be positive', 400);
		}

		const senderUser: IUser = await this.userRepository.findById(senderID);
		const receiverUser: IUser = await this.userRepository.findById(receiverID);

		if (!senderUser || !receiverUser) {
			throw new HttpException('User not found', 404);
		}

		if (senderUser.wallet_balance < amount) {
			const failedTransaction = {
				user: senderUser._id,
				type: 'debit',
				amount: amount,
				date: new Date(),
				status: 'Insufficient funds',
				sender: senderUser._id,
				receiver: receiverUser._id,
			} as ITransaction;

			await this.transactionRepository.create([failedTransaction]);
			throw new HttpException('Insufficient funds', 400);
		}

		const session = await this.transactionRepository.startTransaction();

		try {
			const transactionId = new Types.ObjectId();

			senderUser.wallet_balance -= amount;
			receiverUser.wallet_balance += amount;

			await senderUser.save({ session });
			await receiverUser.save({ session });

			const completedTransactionSender = {
				user: senderUser._id,
				type: 'debit',
				amount: amount,
				date: new Date(),
				status: 'completed',
				sender: senderUser._id,
				receiver: receiverUser._id,
				transactionId: transactionId,
			} as ITransaction;

			const completedTransactionReceiver = {
				user: receiverUser._id,
				type: 'credit',
				amount: amount,
				date: new Date(),
				status: 'completed',
				sender: senderUser._id,
				receiver: receiverUser._id,
				transactionId: transactionId,
			} as ITransaction;

			await this.transactionRepository.create([completedTransactionSender, completedTransactionReceiver], { session });

			await this.transactionRepository.commitTransaction(session);
		} catch (error) {
			await this.transactionRepository.abortTransaction(session);
			throw new HttpException('Transaction failed', 500);
		}
	}

	async getTransactionsForUser(userID: Types.ObjectId): Promise<any[]> {
		const userTransactions = await this.transactionRepository.find({ user: userID });
		return userTransactions.map(transaction => ({
			_id: transaction._id,
			type: transaction.type,
			amount: transaction.amount,
			date: transaction.date,
			status: transaction.status,
		}));
	}

	async getTransactionById(transactionID: Types.ObjectId): Promise<any> {
		const transaction = await this.transactionRepository.findById(transactionID);
		if (!transaction) {
			throw new HttpException('Transaction not found', 404);
		}
		return {
			_id: transaction._id,
			type: transaction.type,
			amount: transaction.amount,
			date: transaction.date,
			status: transaction.status,
		};
	}

	async rollbackTransaction(transactionID: Types.ObjectId): Promise<void> {
		const transactions = await this.transactionRepository.find({ transactionId: transactionID });

		if (transactions.length === 0) {
			throw new HttpException('Transaction not found', 404);
		}

		const session = await this.transactionRepository.startTransaction();

		try {
			const senderUser = await this.userRepository.findById(transactions[0].sender);
			const receiverUser = await this.userRepository.findById(transactions[0].receiver);

			if (!senderUser || !receiverUser) {
				throw new HttpException('User(s) involved in transaction not found', 404);
			}

			if (!transactions.every(tx => tx.status === 'completed')) {
				throw new HttpException('Only completed transactions can be reverted', 403);
			}

			for (const transaction of transactions) {
				transaction.status = 'reverted';
				await transaction.save({ session });
			}

			senderUser.wallet_balance += transactions[0].amount;
			receiverUser.wallet_balance -= transactions[0].amount;

			await senderUser.save({ session });
			await receiverUser.save({ session });

			const revertedTransactionDebit = {
				user: senderUser._id,
				type: 'debit',
				amount: transactions[0].amount,
				date: new Date(),
				status: 'reverted',
				sender: senderUser._id,
				receiver: receiverUser._id,
				transactionId: transactionID,
			} as ITransaction;

			const revertedTransactionCredit = {
				user: receiverUser._id,
				type: 'credit',
				amount: transactions[0].amount,
				date: new Date(),
				status: 'reverted',
				sender: senderUser._id,
				receiver: receiverUser._id,
				transactionId: transactionID,
			} as ITransaction;

			await this.transactionRepository.create([revertedTransactionDebit, revertedTransactionCredit], { session });

			await this.transactionRepository.commitTransaction(session);
		} catch (error) {
			await this.transactionRepository.abortTransaction(session);
			throw new HttpException('Transaction rollback failed', 500);
		}
	}

	async addFunds(userID: Types.ObjectId, amount: number): Promise<void> {
		if (amount <= 0) {
            throw new HttpException('Amount must be positive', 400);
        }

        const user = await this.userRepository.findById(userID);
        if (!user) {
            throw new HttpException('User not found', 404);
        }

        user.wallet_balance += amount;
        await user.save();
	}

}