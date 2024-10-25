import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import { TransactionSchema } from "./transaction.schema";
import { TransactionRepository } from "./transaction.repository";
import { UserModule } from 'src/user/user.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Transaction", schema: TransactionSchema }]),
    UserModule, 
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
  exports: [TransactionService],
})
export class TransactionModule {}
