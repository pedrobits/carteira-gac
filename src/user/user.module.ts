import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from './user.repository'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository], 
})
export class UserModule { }
