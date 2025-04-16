import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsInt, Min, IsString, IsIn } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
	@ApiProperty({
		description: "Numéro de la page",
		example: 1,
		required: false,
		default: 1,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number = 1;

	@ApiProperty({
		description: "Nombre d'éléments par page",
		example: 10,
		required: false,
		default: 10,
	})
	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	limit?: number = 10;

	@ApiProperty({
		description: "Champ sur lequel trier",
		example: "createdAt",
		required: false,
	})
	@IsOptional()
	@IsString()
	orderBy?: string;

	@ApiProperty({
		description: "Ordre de tri (asc ou desc)",
		example: "desc",
		required: false,
		default: "asc",
	})
	@IsOptional()
	@IsIn(["asc", "desc"])
	order?: "asc" | "desc" = "asc";
}
