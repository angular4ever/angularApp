import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { HttpTokenInterceptor } from "@app/core/interceptors/http-token.interceptor";
import { LogInterceptor } from "@app/core/interceptors/log.interceptor";
import { TokenService } from "@app/core/services/token.service";
import { ApiService } from "@app/core/services/api.service";

@NgModule({
	imports: [],
	declarations: [],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpTokenInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: LogInterceptor,
			multi: true
		},
		TokenService,
		ApiService
	]
})
export class CoreModule {
}
