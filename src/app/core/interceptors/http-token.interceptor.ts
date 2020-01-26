import { Injectable } from "@angular/core";
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

import { TokenService } from "@app/core/services/token.service";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
	constructor(private tokenService: TokenService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const headersConfig = {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"X-localization": "uk",
		};

		const token = this.tokenService.getToken();

		if (token) {
			headersConfig["Authorization"] = `Bearer ${token}`;
		}

		const request = req.clone({setHeaders: headersConfig});
		return next.handle(request);
	}
}