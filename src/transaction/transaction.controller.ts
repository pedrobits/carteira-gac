import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { NewTransaction } from "./dto/transaction.entity";
import { TransactionService } from "./transaction.service";
import { ITransaction } from "./dto/transaction.interface";
import { AuthGuard } from "src/auth/auth.guard";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Types } from "mongoose";

@ApiTags('transactions') // Adiciona a tag para a documentação
@Controller('transaction')
export class TransactionController {
	constructor(
		private transactionService: TransactionService,
	) { }

	@Post()
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 201, description: 'Transaction created successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid input or insufficient funds.' })
	async createNewTransaction(@Body() newTransaction: NewTransaction): Promise<{ message: string }> {
		await this.transactionService.createNewTransaction(newTransaction.senderID, newTransaction.receiverID, newTransaction.amount);
		return { message: 'Transaction created successfully' };
	}

	@Get('/user/:userID')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'List of transactions for the user.' })
	@ApiResponse({ status: 404, description: 'No transactions found for the user.' })
	async getTransactionsForUser(@Param('userID') userID: Types.ObjectId): Promise<ITransaction[]> {
		return await this.transactionService.getTransactionsForUser(userID);
	}

	@Get('/:transactionID')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Transaction found successfully.' })
	@ApiResponse({ status: 404, description: 'Transaction not found.' })
	async getTransactionById(@Param('transactionID') transactionID: Types.ObjectId): Promise<ITransaction> {
		return await this.transactionService.getTransactionById(transactionID);
	}

	@Get('rollback/:transactionID')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Rollback of transaction successful.' })
	@ApiResponse({ status: 404, description: 'Transaction not found.' })
	@ApiResponse({ status: 403, description: 'Only completed transactions can be reverted.' })
	async rollbackTransaction(@Param('transactionID') transactionID: Types.ObjectId): Promise<{ message: string }> {
		await this.transactionService.rollbackTransaction(transactionID);
		return { message: `Rollback of transaction ${transactionID} was successful.` };
	}

	@Post('add-funds/:userID')
	@UseGuards(AuthGuard)
	@ApiBearerAuth()
	@ApiResponse({ status: 200, description: 'Funds added to user successfully.' })
	@ApiResponse({ status: 400, description: 'Invalid amount.' })
	@ApiResponse({ status: 404, description: 'User not found.' })
	async addFunds(@Param('userID') userID: Types.ObjectId, @Body('amount') amount: number): Promise<{ message: string }> {
		await this.transactionService.addFunds(userID, amount);
		return { message: `Funds added to user ${userID} successfully.` };
	}
}
