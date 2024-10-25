import { Document, Types } from "mongoose";

export interface ITransaction extends Document {
	user: Types.ObjectId;
	type: 'debit' | 'credit';
	amount: number;
	date: Date;
	status: string;
	relatedTransaction: Types.ObjectId;
	transactionId: Types.ObjectId;
	sender: Types.ObjectId;
	receiver: Types.ObjectId;
}