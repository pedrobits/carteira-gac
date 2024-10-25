import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class NewTransaction {
	@ApiProperty({ description: 'ID do Usuario que irá enviar o dinheiro.' })
	@IsNotEmpty()
	senderID: Types.ObjectId;

	@ApiProperty({ description: 'ID do Usuario que irá receber o dinheiro.' })
	@IsNotEmpty()
	receiverID: Types.ObjectId;

	@ApiProperty({ description: 'Valor da transação.', example: 300 })
	@IsNotEmpty()
	amount: number;
}