import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { AbstractService } from "@/shared/services/abstract.service";

@Injectable()
export class UserService extends AbstractService<UserDocument> {
	constructor(@InjectModel(User.name) userModel: Model<UserDocument>) {
		super(userModel);
	}
}
