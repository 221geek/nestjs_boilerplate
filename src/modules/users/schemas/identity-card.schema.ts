import { Prop, Schema } from "@nestjs/mongoose";
import { IdentityCardType } from "../enums/identity-card-type.enum";

@Schema({ _id: false })
export class IdentityCard {
	@Prop({ enum: IdentityCardType, required: true })
	cardType: IdentityCardType;

	@Prop({ required: true })
	cardNumber: string;

	@Prop({ required: true })
	dateExpiration: string;

	@Prop()
	rectoUrl?: string;

	@Prop()
	versoUrl?: string;
}
