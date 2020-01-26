import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { AddOrEditGroupModel } from "@app/shared/models/add-or-edit-group.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { MainValidationService } from "@app/shared/services/validation.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";

@Component({
	selector: "app-add-or-edit-group-dialog",
	templateUrl: "./add-or-edit-group-modal.component.html",
	styleUrls: ["./add-or-edit-group-modal.component.scss"],
})
export class AddOrEditGroupModalComponent implements OnInit {

	addOrEditGroupForm: FormGroup;
	addOrEditGroupFormSubmitted = false;
	formTitle: string;

	constructor(private dialogRef: MatDialogRef<AddOrEditGroupModalComponent>,
				@Inject(MAT_DIALOG_DATA) public data: AddOrEditGroupModel,
				private translate: TranslateService,
				private toastrActionsSvc: ToastrActionsService,
				private mainValidSvc: MainValidationService,
				private groupActionsSvc: GroupActionsService) {
	}

	ngOnInit() {
		this.addOrEditGroupForm = this.mainValidSvc.createOrEditGroupForm();
		if (this.data.type === "edit") {
			this.fillData();
			this.formTitle = this.translate.instant("CONTENT.EDITGROUP");
		} else if (this.data.type === "add") {
			this.formTitle = this.translate.instant("CONTENT.ADDNEWGROUP");
		}
	}

	fillData(): void {
		Object.keys(this.addOrEditGroupForm.value).map(property => {
			this.addOrEditGroupForm.patchValue({
				[property]: this.data.params[property]
			});
		});
	}

	get form(): any {
		return this.addOrEditGroupForm.controls;
	}

	createGroup(): void {
		const isEditingData = this.data.type === "edit" ? +this.data.params.id : null;
		this.addOrEditGroupFormSubmitted = true;
		if (this.addOrEditGroupForm.invalid) {
			return;
		}
		if (this.groupActionsSvc.checkUniqueGroupName(this.addOrEditGroupForm.value.name, isEditingData)) {
			this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.GROUPNAMEALREADYUSED"));
			return;
		}
		this.dialogRef.close(this.addOrEditGroupForm.value);
	}
}
