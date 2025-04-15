import { Module } from "@nestjs/common";
import { CustomHttpService } from "./custom-http.service";
import { HttpModule } from "@nestjs/axios";

@Module({
	imports: [HttpModule],
	providers: [CustomHttpService],
	exports: [CustomHttpService],
})
export class CustomHttpModule {}
