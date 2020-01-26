import { Injectable } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

@Injectable()
export class MainValidationService {

	constructor(private formBuilder: FormBuilder) {
	}

	createOrEditGroupForm(): any {
		return this.formBuilder.group({
			name: ["", [
				Validators.required
			]],
			description: ["", []],
			groupLogoLink: ["", []],
			username: ["", []],
			password: ["", []]
		});
	}

	addOrEditDeviceForm(): any {
		return this.formBuilder.group({
			name: ["", [
				Validators.required
			]],
			uriIdentifier: ["", [
				Validators.required,
				Validators.pattern("^[a-zA-Z0-9_:./-]*$")
			]],
			uidIdentifier: ["", [
				Validators.required,
				Validators.pattern("^[a-zA-Z0-9]*$")
			]],
			profileType: ["", [
				Validators.required
			]],
			username: ["", []],
			password: ["", []]
		});
	}

	editValueModalForm(): any {
		return this.formBuilder.group({
			firstValue: ["", [
				Validators.required,
				Validators.pattern("[0-9]+")
			]]
		});
	}
}
