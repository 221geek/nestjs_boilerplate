import { Prop, Schema } from "@nestjs/mongoose";
import { PhoneType } from "../enums/phone-type.enum";

@Schema({ _id: false })
export class PhoneNumber {
	@Prop({ required: true })
	countryCode: string;

	@Prop({ required: true })
	number: string;

	@Prop({ enum: PhoneType, required: true })
	type: PhoneType;

	@Prop({ default: false })
	isPrimary: boolean;
}
