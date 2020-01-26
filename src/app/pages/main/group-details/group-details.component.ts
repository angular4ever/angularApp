import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { DeviceModel } from "@app/shared/models/device.model";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { ModalsService } from "@app/shared/services/modals.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { BrokerActionsService } from "@app/shared/services/broker-actions.service";

@Component({
	selector: "app-group-details",
	templateUrl: "group-details.component.html",
	styleUrls: ["group-details.component.scss"],
})
export class GroupDetailsComponent implements OnInit {

	headerConfig: DefaultHeaderConfigModel;
	groupDevicesConfig: GroupDevicesModel = {};

	constructor(private route: ActivatedRoute,
				private router: Router,
				private toastr: ToastrService,
				private translate: TranslateService,
				private deviceActionsSvc: DeviceActionsService,
				private modalSvc: ModalsService,
				private componentsConfigsSvc: ComponentsConfigsService,
				private groupActionsSvc: GroupActionsService,
				private brokerActionsSvc: BrokerActionsService) {
	}

	ngOnInit() {
		this.initConfig();
	}

	ionViewWillEnter() {
		this.initConfig();
		this.setGroupIdInStorage();
	}

	initConfig(): void {
		this.groupDevicesConfig = this.groupActionsSvc.getGroupById(this.route.snapshot.params.id);
		this.headerConfig = this.componentsConfigsSvc.getGroupDetailsHeaderConfig();
		this.headerConfig.headerTitle = this.groupDevicesConfig.name;
	}

	setGroupIdInStorage(): void {
		this.groupActionsSvc.setGroupInStorage(this.route.snapshot.params.id);
	}

	headerHandler(value: string): void {
		if (value === "goBack") {
			this.router.navigate(["/main/main-dashboard/"]);
		} else if (value === "Edit group") {
			this.showEditModal();
		} else if (value === "Delete") {
			this.showDeleteModal();
		}
	}

	showEditModal(): void {
		this.modalSvc.addOrEditGroup({item: this.groupDevicesConfig, type: "edit"}, (res: GroupDevicesModel) => {
			if (res) {
				Object.keys(res).map(property => {
					this.groupDevicesConfig[property] = res[property];
				});
				this.groupDevicesConfig.devices.forEach(device => {
					device.groupPassword = res.password;
					device.groupUsername = res.username;
				});
				this.headerConfig.headerTitle = res.name;
				this.groupActionsSvc.updateOrRemoveGroup(this.groupDevicesConfig, "update");
			}
		});
	}

	showDeleteModal(): void {
		let warningGroup = "";
		if (this.groupDevicesConfig.devices.length) {
			warningGroup = this.translate.instant("CONTENT.GROUPINCLUDEDDEVICES");
		}
		this.modalSvc.showDefaultConfirmModal({
			titleText: `${this.translate.instant("CONTENT.CONFIRMDELETEGROUP")} ${this.groupDevicesConfig.name}? 
			${warningGroup}.`
		}, (res: boolean) => {
			if (res) {
				this.groupActionsSvc.updateOrRemoveGroup(this.groupDevicesConfig, "remove");
				this.router.navigate(["/main/main-dashboard"]);
			}
		});
	}

	groupDevicesHandler(device: DeviceModel): void {
		switch (device.type) {
			case "selectFavorite":
				device.favorite = !device.favorite;
				this.deviceActionsSvc.updateOrRemoveDeviceInGroup(device, "update");
				break;
			case "changeRoute":
				this.brokerActionsSvc.checkConnectionToBroker(device).then((res: DeviceModel) => {
					if (res.status) {
						this.router.navigate(["/main/device-details", device.id]);
					} else if (!res.status) {
						this.brokerActionsSvc.showErrorToastr(res.type, device.name);
					}
				});
				break;
			case "editItem":
				const data = {
					prevPage: "group-details"
				};
				this.router.navigate(["/main/edit-device", device.id], {state: data});
				break;
			case "moveItem":
				this.showMoveDeviceModal(device);
				break;
			case "deleteItem":
				this.showConfirmDeleteModal(device);
				break;
			default:
				break;
		}
	}

	showMoveDeviceModal(device: DeviceModel): void {
		this.modalSvc.moveDeviceToGroup({groupId: device.groupId}, (res: DeviceModel) => {
			if (res) {
				const currentGroup = this.groupActionsSvc.getGroupById(+res.id);
				device = this.deviceActionsSvc.moveDeviceAction(device, currentGroup);
				device.groupPassword = res.password;
				device.groupUsername = res.username;
				this.deviceActionsSvc.updateOrRemoveDeviceInGroup(device, "remove");
				device.groupId = res.id;
				this.deviceActionsSvc.addDeviceInGroup(device, res.id);
				this.groupDevicesConfig.devices.splice(
					this.groupDevicesConfig.devices.findIndex(item => item.id === device.id), 1);
			}
		});
	}

	showConfirmDeleteModal(device: DeviceModel): void {
		this.modalSvc.showDefaultConfirmModal({
			titleText: `${this.translate.instant("CONTENT.CONFIRMDELETEDEVICE")} ${device.name}?`,
			contentText: "",
			cancelBtnText: this.translate.instant("CONTENT.CANCEL"),
			submitBtnText: this.translate.instant("CONTENT.DELETE")
		}, (res: DeviceModel) => {
			if (res) {
				this.groupDevicesConfig.devices.splice(
					this.groupDevicesConfig.devices.findIndex(item => item.id === device.id), 1);
				this.deviceActionsSvc.updateOrRemoveDeviceInGroup(device, "remove");
			}
		});
	}

	fabHandler(): void {
		this.router.navigate(["/main/add-device", this.groupDevicesConfig.id]);
	}
}
