import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { DefaultConfirmModalModel } from "@app/shared/models/default-confirm-modal.model";

@Component({
	selector: "app-default-confirm-modal",
	templateUrl: "./default-confirm-modal.component.html",
	styleUrls: ["./default-confirm-modal.component.scss"],
})
export class DefaultConfirmModalComponent implements OnInit {

	title: string;
	contentText: string;
	hideButtons: boolean;
	cancelBtnText: string;
	submitBtnText: string;

	constructor(@Inject(MAT_DIALOG_DATA) private data: DefaultConfirmModalModel,
				private translate: TranslateService) {
	}

	ngOnInit() {
		this.title = this.data.params.titleText || "";
		this.contentText = this.data.params.contentText || "";
		this.hideButtons = this.data.params.hideButtons || false;
		this.cancelBtnText = this.data.params.cancelBtnText || this.translate.instant("CONTENT.CANCEL");
		this.submitBtnText = this.data.params.submitBtnText || this.translate.instant("CONTENT.OK");
	}
}
