import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { ToastrService } from "ngx-toastr";

@Injectable()
export class LogInterceptor implements HttpInterceptor {
	constructor(private toastr: ToastrService) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(req).pipe(
			map((event: HttpEvent<any>) => {
				// if (event instanceof HttpResponse) {
				// 	console.log('event--->>>', event);
				// }
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				console.log(error);
				let message = error.error.data || error.message;
				if (error.error.data) {
					message = error.status + " " + message;
				}
				this.toastr.error(message, "Request error");
				return throwError(error);
			}));
	}
}
