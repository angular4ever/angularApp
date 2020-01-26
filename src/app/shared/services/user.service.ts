import { Injectable } from "@angular/core";

@Injectable()
export class UserService {

	constructor() {
	}

	setUserDataInStorage(data: object): void {
		localStorage.setItem("userData", JSON.stringify(data));
	}

	getUserDataFromStorage(): any {
		return JSON.parse(localStorage.getItem("userData"));
	}
}
