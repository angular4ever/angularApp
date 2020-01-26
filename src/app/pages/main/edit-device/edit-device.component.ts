import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { ProfileTypesModel } from "@app/shared/models/profile-types.model";
import { DeviceModel } from "@app/shared/models/device.model";
import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { BrokerActionsService } from "@app/shared/services/broker-actions.service";
import { MainValidationService } from "@app/shared/services/validation.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";

@Component({
	selector: "app-edit-device",
	templateUrl: "edit-device.component.html",
	styleUrls: ["edit-device.component.scss"]
})
export class EditDeviceComponent implements OnInit {

	editDeviceForm: FormGroup;
	editDeviceFormSubmitted = false;
	headerConfig: DefaultHeaderConfigModel = {};
	allProfileTypes: ProfileTypesModel[] = [];
	currentDevice: DeviceModel = {};
	currentGroup: GroupDevicesModel = {};
	previousUrl: string;
	selectedProfileType = {};

	constructor(private router: Router,
				private route: ActivatedRoute,
				private translate: TranslateService,
				private toastrActinosSvc: ToastrActionsService,
				private deviceActionsSvc: DeviceActionsService,
				private groupActionsSvc: GroupActionsService,
				private brokerActionsSvc: BrokerActionsService,
				private componentsConfigsSvc: ComponentsConfigsService,
				private mainValidSvc: MainValidationService) {
		const data = this.deviceActionsSvc.getDeviceInGroup(+this.route.snapshot.paramMap.get("id"));
		const extras = this.router.getCurrentNavigation().extras;
		this.currentDevice = data.device;
		this.currentGroup = data.group;
		if (extras && extras.state && extras.state.prevPage) {
			this.previousUrl = this.router.getCurrentNavigation().extras.state.prevPage;
		}
	}

	ngOnInit() {
		this.initConfig();
		this.fillData();
	}

	initConfig(): void {
		this.headerConfig = {headerTitle: this.translate.instant("CONTENT.EDITDEVICE"), hideMenu: true, hideBackBtn: true};
		this.editDeviceForm = this.mainValidSvc.addOrEditDeviceForm();
		this.allProfileTypes = this.componentsConfigsSvc.getDeviceProfileTypes();
	}

	fillData(): void {
		Object.keys(this.editDeviceForm.value).map(property => {
			this.editDeviceForm.patchValue({
				[property]: this.currentDevice[property]
			});
		});
		const selectCurrent = this.allProfileTypes.find(item => item.key === this.currentDevice.profileType.key);
		this.editDeviceForm.get("profileType").setValue(selectCurrent);
		this.selectedProfileType = this.currentDevice.profileType;
	}

	get form(): object {
		return this.editDeviceForm.controls;
	}

	editDevice(): void {
		event.stopPropagation();
		this.editDeviceFormSubmitted = true;
		if (this.checkOnValidForm() === false) {
			return;
		}
		if (this.deviceActionsSvc.checkUniqueDeviceName(
			this.currentGroup.id,
			this.editDeviceForm.value.name,
			this.currentDevice.id) === false) {
			this.toastrActinosSvc.showToastr("warning", this.translate.instant("CONTENT.DEVICENAMEISALREADYUSED"));
			return;
		}
		Object.keys(this.editDeviceForm.value).map(property => {
			this.currentDevice[property] = this.editDeviceForm.value[property];
		});
		this.changeCurrentDeviceData();
		this.deviceActionsSvc.updateOrRemoveDeviceInGroup(this.currentDevice, "update");
		this.changeRoute();
	}

	changeCurrentDeviceData(): void {
		const profileKey = this.editDeviceForm.value.profileType.key;
		if (this.currentDevice.isUseGroupLogin) {
			this.currentDevice.groupUsername = this.currentGroup.username;
			this.currentDevice.groupPassword = this.currentGroup.password;
		}
		this.currentDevice.deviceLogoLink = this.allProfileTypes[profileKey].logo;
		this.currentDevice.deviceStatus = this.deviceActionsSvc.setDeviceType(profileKey);
	}

	checkOnValidForm(): boolean {
		const formValue = this.editDeviceForm.value;
		if (this.editDeviceForm.invalid) {
			return false;
		} else if (!this.currentDevice.isUseGroupLogin && (!formValue.username.length || !formValue.password.length)) {
			this.toastrActinosSvc.showToastr("warning", this.translate.instant("CONTENT.FILLAUTHDATA"));
			return false;
		}
		return true;
	}

	changeRoute(): void {
		const groupId = this.groupActionsSvc.getGroupIdFromStorage();
		if (this.previousUrl === "group-details") {
			this.router.navigate(["/main/group-details", groupId]);
		} else {
			this.brokerActionsSvc.checkConnectionToBroker(this.currentDevice).then((res: DeviceModel) => {
				if (res.status) {
					this.router.navigate(["/main/device-details", this.currentDevice.id]);
				} else {
					this.router.navigate(["/main/group-details", groupId]);
				}
			});
		}
	}
}
