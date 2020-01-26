import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { DeviceModel } from "@app/shared/models/device.model";
import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { ModalsService } from "@app/shared/services/modals.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { BrokerActionsService } from "@app/shared/services/broker-actions.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { AppService } from "@app/shared/services/app.service";

@Component({
	selector: "app-main-dashboard",
	templateUrl: "main-dashboard.component.html",
	styleUrls: ["main-dashboard.component.scss"],
})
export class MainDashboardComponent implements OnInit, AfterViewInit {

	favouritesDevices: Array<DeviceModel>;
	groupOfDevices: GroupDevicesModel[] = [];
	headerConfig: DefaultHeaderConfigModel = {};
	appVersion = "";
	activeTab = 0;

	constructor(private router: Router,
				private translate: TranslateService,
				private deviceActionsSvc: DeviceActionsService,
				private modalSvc: ModalsService,
				private componentsConfigsSvc: ComponentsConfigsService,
				private brokerActionsSvc: BrokerActionsService,
				private groupActionsSvc: GroupActionsService,
				private appSvc: AppService) {
	}

	ngOnInit() {
		this.loadData();
		this.getAppVersion();
	}

	ionViewWillEnter() {
		this.loadData();
	}

	ngAfterViewInit() {
		// click for activate back buttons subscription
		const element: HTMLElement = document.getElementsByClassName("title-container")[0] as HTMLElement;
		element.click();
	}

	loadData(): void {
		this.headerConfig = this.componentsConfigsSvc.getMainPageMenuConfig();
		this.favouritesDevices = this.deviceActionsSvc.getFavouritesDevices();
		this.groupOfDevices = this.groupActionsSvc.getGroups() || [];
	}

	getAppVersion(): void {
		this.appSvc.appVersionChange.subscribe(value => {
			this.appVersion = value;
			this.appSvc.appVersionChange.unsubscribe();
		});
	}

	headerHandler(value: string): void {
		if (value === "About") {
			this.modalSvc.showDefaultConfirmModal({
				titleText: `${this.translate.instant("CONTENT.APPVERSION")} ${this.appVersion}`,
				hideButtons: true,
				submitBtnText: this.translate.instant("CONTENT.OK")
			});
		} else if (value === "Settings") {
			this.router.navigate(["/main/setting"]);
		} else if (value === "Exit") {
			this.modalSvc.showDefaultConfirmModal({
				titleText: this.translate.instant("CONTENT.DOYOUWANTTOEXITFROMAPP")
			}, (res: boolean) => {
				if (res) {
					navigator["app"].exitApp();
				}
			});
		}
	}

	createNewGroup(): void {
		this.modalSvc.addOrEditGroup({type: "add"}, (res: GroupDevicesModel) => {
			if (res) {
				this.saveGroup(res);
			}
		});
	}

	saveGroup(res: GroupDevicesModel): void {
		res.id = +new Date();
		res.type = "group";
		res.devices = [];
		this.groupOfDevices.push(res);
		this.groupActionsSvc.saveGroup(this.groupOfDevices);
	}

	groupsListHandler(group: GroupDevicesModel): void {
		if (group.type === "changeRoute") {
			this.router.navigate(["/main/group-details", group.id]);
		} else if (group.type === "editItem") {
			this.showEditModal(group);
		} else if (group.type === "deleteItem") {
			this.showDeleteModal(group);
		} else if (group.type === "updateData") {
			this.loadData();
		}
	}

	showEditModal(group: GroupDevicesModel): void {
		this.modalSvc.addOrEditGroup({item: group, type: "edit"}, (res: GroupDevicesModel) => {
			if (res) {
				const currentGroup = this.groupActionsSvc.getGroupById(group.id);
				Object.keys(res).map(property => {
					currentGroup[property] = res[property];
				});
				currentGroup.devices.forEach(device => {
					device.groupPassword = res.password;
					device.groupUsername = res.username;
				});
				this.groupActionsSvc.updateOrRemoveGroup(currentGroup, "update");
				this.favouritesDevices = this.deviceActionsSvc.getFavouritesDevices();
				this.groupOfDevices.splice(
					this.groupOfDevices.findIndex(item => item.id === group.id), 1, currentGroup);
			}
		});
	}

	showDeleteModal(group: GroupDevicesModel): void {
		let warningGroup = "";
		if (group.devices.length) {
			warningGroup = this.translate.instant("CONTENT.GROUPINCLUDEDDEVICES");
		}
		this.modalSvc.showDefaultConfirmModal({
			titleText: `${this.translate.instant("CONTENT.CONFIRMDELETEGROUP")} ${group.name}? ${warningGroup}.`
		}, (res: boolean) => {
			if (res) {
				this.groupOfDevices.splice(this.groupOfDevices.findIndex(item => item.id === group.id), 1);
				this.groupActionsSvc.updateOrRemoveGroup(group, "remove");
			}
		});
	}

	selectedFavoriteDeviceHandler(device: DeviceModel): void {
		this.brokerActionsSvc.checkConnectionToBroker(device).then((res: DeviceModel) => {
			if (res.status) {
				const data = {
					prevPage: "main-page"
				};
				this.router.navigate(["/main/device-details", device.id], {state: data});
			} else if (!res.status) {
				this.brokerActionsSvc.showErrorToastr(res.type, device.name);
			}
		});
	}

	fabHandler(): void {
		this.createNewGroup();
	}
}
