import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { FormGroup } from "@angular/forms";

import { MainValidationService } from "@app/shared/services/validation.service";
import { UtilsService } from "@app/shared/services/utils.service";

@Component({
	selector: "app-default-actions-modal",
	templateUrl: "./default-actions-modal.component.html",
	styleUrls: ["./default-actions-modal.component.scss"],
})
export class DefaultActionsModalComponent implements OnInit {

	editValueForm: FormGroup;
	editValueFormSubmitted = false;
	title: string;
	description: string;
	componentType: string;
	analogRadioValue = 0;
	analogRadioArray = [];
	analogRadioSelectCounter = 3;

	constructor(private dialogRef: MatDialogRef<DefaultActionsModalComponent>,
				@Inject(MAT_DIALOG_DATA) public data: any,
				private mainValidSvc: MainValidationService,
				private utilsSvc: UtilsService) {
	}

	ngOnInit() {
		this.initializationData();
	}

	initializationData(): void {
		this.title = this.data.params.title || "Title";
		this.description = this.data.params.description || "";
		this.componentType = this.data.params.componentType || "";
		if (this.componentType === "analogOutput" &&
			this.data.params.item.type === "circle-radio") {
			this.analogRadioArray = this.utilsSvc.getArrayWithValues(this.analogRadioSelectCounter);
			this.analogRadioValue = this.data.params.item.counter;
		} else if (this.componentType === "analogInput" ||
			this.componentType === "analogOutput") {
			this.editValueForm = this.mainValidSvc.editValueModalForm();
			this.fillAnalogData();
		}
	}

	get form(): any {
		return this.editValueForm.controls;
	}

	fillAnalogData(): void {
		this.changeFormValue(this.data.params.item.counter);
	}

	changeAnalogData(event: any): void {
		this.changeFormValue(event.detail.value);
	}

	changeFormValue(value: number): void {
		this.editValueForm.patchValue({
			firstValue: value
		});
	}

	submitForm(): void {
		if (this.componentType === "analogOutput" &&
			this.data.params.item.type === "circle-radio") {
			this.analogOutputCircleData();
		} else if (this.componentType === "analogOutput") {
			this.returnAnalogInputData();
		}
	}

	analogOutputCircleData(): void {
		this.data.params.item.counter = this.analogRadioValue;
		this.dialogRef.close(this.data.params.item);
	}

	returnAnalogInputData(): void {
		this.editValueFormSubmitted = true;
		if (this.editValueForm.invalid) {
			return;
		}
		this.data.params.item.counter = this.editValueForm.value.firstValue;
		this.dialogRef.close(this.data.params.item);
	}
}
