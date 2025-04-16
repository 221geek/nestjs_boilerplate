import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ _id: false })
export class CreatedBy {
	@Prop({ required: true })
	organism: string;

	@Prop({ required: true })
	username: string;

	@Prop({ required: true })
	externalId: string;
}
