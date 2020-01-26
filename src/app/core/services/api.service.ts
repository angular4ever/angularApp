import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { environment } from "src/environments/environment";

@Injectable()
export class ApiService {
	constructor(private http: HttpClient) {
	}

	private formatErrors(error: any) {
		return throwError(error);
	}

	get(path: string, params: any = {}): Observable<any> {
		return this.http.get(`${environment.api_url}${path}`, {params})
			.pipe(catchError(this.formatErrors));
	}

	put(path: string, body: any = {}): Observable<any> {
		return this.http.put(
			`${environment.api_url}${path}`,
			JSON.stringify(body)
		).pipe(catchError(this.formatErrors));
	}

	post(path: string, body: any = {}): Observable<any> {
		return this.http.post(
			`${environment.api_url}${path}`,
			body
		).pipe(catchError(this.formatErrors));
	}

	delete(path): Observable<any> {
		return this.http.delete(
			`${environment.api_url}${path}`
		).pipe(catchError(this.formatErrors));
	}
}
