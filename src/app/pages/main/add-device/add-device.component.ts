import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { TranslateService } from "@ngx-translate/core";

import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { ProfileTypesModel } from "@app/shared/models/profile-types.model";
import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { MainValidationService } from "@app/shared/services/validation.service";

@Component({
	selector: "app-add-device",
	templateUrl: "add-device.component.html",
	styleUrls: ["add-device.component.scss"],
	encapsulation: ViewEncapsulation.None
})

export class AddDeviceComponent implements OnInit {

	addDeviceForm: FormGroup;
	addDeviceFormSubmitted = false;
	headerConfig: DefaultHeaderConfigModel;
	allProfileTypes: Array<ProfileTypesModel>;
	isUsingLoginData = true;
	currentGroup: GroupDevicesModel;
	selectedProfileType = {};

	constructor(private route: ActivatedRoute,
				private router: Router,
				private barcodeScanner: BarcodeScanner,
				private translate: TranslateService,
				private toastrActionsSvc: ToastrActionsService,
				private deviceActionsSvc: DeviceActionsService,
				private groupActionSvc: GroupActionsService,
				private componentsConfigsSvc: ComponentsConfigsService,
				private mainValidSvc: MainValidationService) {
	}

	ngOnInit() {
		this.headerConfig = {headerTitle: this.translate.instant("CONTENT.ADDDEVICE"), hideMenu: true};
		this.addDeviceForm = this.mainValidSvc.addOrEditDeviceForm();
		this.allProfileTypes = this.componentsConfigsSvc.getDeviceProfileTypes();
		this.currentGroup = this.groupActionSvc.getGroupById(this.route.snapshot.params.id);
	}

	headerHandler(value: string): void {
		if (value === "goBack") {
			this.router.navigate(["/main/group-details", this.route.snapshot.params.id]);
		}
	}

	get form(): any {
		return this.addDeviceForm.controls;
	}

	startQrScan(): void {
		this.barcodeScanner
			.scan()
			.then(barcodeData => {
				const dataString = atob(barcodeData.text);
				this.addDeviceForm.patchValue({
					uriIdentifier: dataString.substr(dataString.indexOf(";") + 1,
						dataString.indexOf(";", dataString.indexOf(";") + 1) - dataString.indexOf(";") - 1),
					uidIdentifier: dataString.substr(dataString.indexOf(";", dataString.indexOf(";") + 1) + 1, dataString.length),
					profileType: this.setProfileType(dataString.substr(0, dataString.indexOf(";")))
				});
			})
			.catch(err => {
				console.log("Error", err);
			});
	}

	setProfileType(shortProfileType: string): string {
		switch (shortProfileType) {
			case "s1":
				return "Digital I/O";
				break;
			case "s2":
				return "Analog I/O";
				break;
			default:
				return "";
		}
	}

	addDevice(): void {
		this.addDeviceFormSubmitted = true;
		if (this.checkOnValidForm() === false) {
			return;
		}
		if (this.deviceActionsSvc.checkUniqueDeviceName(
			+this.route.snapshot.params.id,
			this.addDeviceForm.value.name) === false) {
			this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.DEVICENAMEISALREADYUSED"));
			return;
		}
		if (this.isUsingLoginData) {
			this.addDeviceForm.value.groupUsername = this.currentGroup.username;
			this.addDeviceForm.value.groupPassword = this.currentGroup.password;
		}
		this.addDeviceForm.value.deviceLogoLink = this.allProfileTypes[this.addDeviceForm.value.profileType.key].logo;
		this.addDeviceForm.value.isUseGroupLogin = this.isUsingLoginData;
		this.deviceActionsSvc.addDeviceInGroup(
			this.addDeviceForm.value,
			+this.route.snapshot.params.id);
		this.router.navigate(["/main/group-details", this.route.snapshot.params.id]);
	}

	checkOnValidForm(): boolean {
		const formValue = this.addDeviceForm.value;
		if (this.addDeviceForm.invalid) {
			return false;
		} else if (!this.isUsingLoginData && (!formValue.username.length || !formValue.password.length)) {
			this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.FILLAUTHDATA"));
			return false;
		}
		return true;
	}
}
