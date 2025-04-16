import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { PhoneNumber } from "./phone-number.schema";
import { UserCreationSource } from "../enums/user-creation-source.enum";
import { AccountStatus } from "../enums/account-status.enum";
import { AccountType } from "../enums/account-type.enum";
import { HealthUniqueNumber } from "./health-unique-number.schema";
import { Sex } from "../enums/sex.enum";
import { Address } from "./address.schema";
import { IdentityCard } from "./identity-card.schema";
import { CreatedBy } from "./created-by.schema";

@Schema({ _id: false })
export class CodedValue {
	@Prop({ required: true })
	identifier: string;

	@Prop({ required: true })
	eyoneExternalId: string;

	@Prop({ required: true })
	code: string;

	@Prop({ required: true })
	label: string;

	@Prop()
	message?: string;
}

export type UserDocument = User & Document;

@Schema({
	timestamps: true,
	toJSON: {
		transform: (_, ret) => {
			delete ret.__v;
			return ret;
		},
	},
})
export class User {
	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	firstName: string;

	@Prop({ required: true })
	lastName: string;

	@Prop({ type: [String], default: ["user"] })
	roles: string[];

	@Prop({ default: true })
	isActive: boolean;

	@Prop()
	passportNumber: string;

	@Prop({ type: [PhoneNumber], default: [] })
	phoneNumbers: PhoneNumber[];

	@Prop()
	birthday: string;

	@Prop()
	placeOfBirth: string;

	@Prop({ enum: Sex, required: false })
	sex: Sex;

	@Prop({ enum: UserCreationSource, required: true })
	creationSource: UserCreationSource;

	@Prop({ enum: AccountStatus, required: true })
	status: AccountStatus;

	@Prop({ enum: AccountType, required: true })
	accountType: AccountType;

	@Prop({
		type: Types.ObjectId,
		ref: "User",
		required: function (this: User) {
			return this.accountType === AccountType.SUB;
		},
	})
	parentAccountId?: Types.ObjectId;

	@Prop()
	keycloakId?: string;

	@Prop({ type: [IdentityCard], default: [] })
	identityCards: IdentityCard[];

	@Prop({ type: HealthUniqueNumber })
	healthUniqueNumber: HealthUniqueNumber;

	@Prop({ type: [Address], default: [] })
	addresses: Address[];

	@Prop({ type: CodedValue })
	nationality?: CodedValue;

	@Prop({ type: CodedValue })
	bloodGroup?: CodedValue;

	@Prop({ type: CodedValue })
	profession?: CodedValue;

	@Prop({ type: CodedValue })
	studyLevel?: CodedValue;

	@Prop({ type: CodedValue })
	maritalStatus?: CodedValue;

	@Prop({ type: CreatedBy, required: false })
	createdBy?: CreatedBy;

	@Prop()
	weight?: number;

	@Prop()
	height?: number;

	@Prop()
	ethnicity?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
