import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Address {
	@Prop()
	street: string;

	@Prop({ default: "Senegal" })
	country: string;

	@Prop()
	region: string;

	@Prop()
	departement: string;

	@Prop()
	commune: string;

	@Prop()
	neighborhood: string;

	@Prop({ default: false })
	isCurrent: boolean;
}
