import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class AppService {

	appVersionChange: Subject<string> = new Subject<string>();

	constructor() {
	}

	setAppVersion(version: string): void {
		this.appVersionChange.next(version);
	}
}
