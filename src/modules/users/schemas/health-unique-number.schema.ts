import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class HealthUniqueNumber {
	@Prop({ required: true })
	number: string;

	@Prop({ required: true })
	createdAt: Date;
}
