import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import { User, UserSchema } from "./schemas/user.schema";
import { CaslModule } from "../casl/casl.module";
import { UserService } from "./users.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		CaslModule,
	],
	controllers: [UsersController],
	providers: [UserService],
	exports: [UserService],
})
export class UsersModule {}
