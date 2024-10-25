import mongoose, { Schema } from 'mongoose';
import { ITransaction } from './dto/transaction.interface';

export const TransactionSchema = new Schema<ITransaction>({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	type: { type: String, default: 'debit', enum: ['debit', 'credit'], required: true },
	amount: { type: Number, required: true },
	date: { type: Date, default: Date.now },
	status: { type: String, default: 'completed' },
	relatedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }, 
	transactionId: { type: mongoose.Schema.Types.ObjectId, required: true },
	sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});
