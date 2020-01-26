import { Injectable } from "@angular/core";

@Injectable()
export class TokenService {

	getToken(): string {
		return window.localStorage["authToken"];
	}

	saveToken(token: string) {
		window.localStorage["authToken"] = token;
	}

	destroyToken() {
		window.localStorage.removeItem("authToken");
	}
}
