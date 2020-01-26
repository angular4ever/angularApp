import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable()
export class ToastrActionsService {

	constructor(private toastr: ToastrService) {
	}

	showToastr(type: string, text: string): void {
		this.toastr.clear();
		this.toastr[type](text);
	}
}
