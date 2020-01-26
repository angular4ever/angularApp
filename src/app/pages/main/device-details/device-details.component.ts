import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { DeviceModel } from "@app/shared/models/device.model";
import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { DefaultNavigationActionsModel } from "@app/shared/models/default-navigation-actions.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { ModalsService } from "@app/shared/services/modals.service";

@Component({
	selector: "app-device-details",
	templateUrl: "device-details.component.html",
	styleUrls: ["device-details.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class DeviceDetailsComponent implements OnInit {

	selectedDevice: DeviceModel = {};
	headerConfig: DefaultHeaderConfigModel = {};
	client: any;
	prevPageName: string;

	constructor(private router: Router,
				private route: ActivatedRoute,
				private translate: TranslateService,
				private toastrActionsSvc: ToastrActionsService,
				private deviceActionsSvc: DeviceActionsService,
				private groupActionsSvc: GroupActionsService,
				private componentsConfigsSvc: ComponentsConfigsService,
				private modalSvc: ModalsService) {
		this.loadDeviceData(this.router.getCurrentNavigation().extras.state);
	}

	ngOnInit() {
		this.initConfig();
	}

	ionViewWillEnter() {
		this.loadDeviceData();
		this.initConfig();
		this.setDeviceInStorage();
		this.connectToBroker();
	}

	loadDeviceData(previousState: DefaultNavigationActionsModel = {}): void {
		this.selectedDevice = this.deviceActionsSvc.getDeviceInGroup(+this.route.snapshot.paramMap.get("id")).device;
		if (previousState && previousState.prevPage) {
			this.prevPageName = previousState.prevPage;
		}
	}

	initConfig(): void {
		this.headerConfig = this.componentsConfigsSvc.getDeviceMenuConfig();
		this.headerConfig.headerTitle = this.selectedDevice.name;
		this.headerConfig.groupName = this.groupActionsSvc.getGroupById(this.selectedDevice.groupId).name;
	}

	setDeviceInStorage(): void {
		this.deviceActionsSvc.setDeviceInStorage(this.route.snapshot.paramMap.get("id"));
	}

	connectToBroker(): void {
		const randomId = +new Date();
		const loginData = {
			username: this.selectedDevice.isUseGroupLogin ? this.selectedDevice.groupUsername : this.selectedDevice.username,
			password: this.selectedDevice.isUseGroupLogin ? this.selectedDevice.groupPassword : this.selectedDevice.password,
			clientId: randomId.toString(),
			keepAlive: 180
		};
		this.client = (window as any).mqtt.connect(`ws://${this.selectedDevice.uriIdentifier}:15675/ws`, loginData);

		// install connect callback
		this.client.on("connect", () => {
			this.onConnect();
		});

		// install message callback
		this.client.on("message", (topic, msg) => {
			const subTopic = topic.substr(topic.lastIndexOf("/") + 1);
			console.log("Received: " + subTopic + ": " + msg.toString());
			this.onMessage(subTopic, JSON.parse(msg));
		});

		// install subscriptions
		this.subscribe("connectionState");
		this.subscribe("deviceState");
		this.subscribe("digInState");
		this.subscribe("digOutState");

		this.subscribe("anaOutValue[0]");
		this.subscribe("anaOutValue[1]");
		this.subscribe("anaOutValue[2]");

		this.subscribe("anaInValue[0]");
		this.subscribe("anaInValue[1]");
		this.subscribe("anaInValue[2]");
	}

	subscribe(topic: string) {
		this.client.subscribe("devices/" + this.selectedDevice.uidIdentifier + "/" + topic, {}, () => {});
	}

	onConnect() {
		console.log("Connect success");
	}

	onMessage(topic: string, msg) {

		if ("online" in msg) {
			this.selectedDevice.deviceStatus[0].connectionState.status = msg.online;
		}

		if ("uptime" in msg) {
			this.selectedDevice.deviceStatus[0].uptime.timeInWork = ((String)(msg.uptime)).split("\n");
		}

		if ("temperature" in msg) {
			this.selectedDevice.deviceStatus[0].temperature.temp = msg.temperature;
		}

		if ("inputs" in msg) {
			this.selectedDevice.deviceStatus[1].params[0].status = msg.inputs[0];
			this.selectedDevice.deviceStatus[1].params[1].status = msg.inputs[1];
			this.selectedDevice.deviceStatus[1].params[2].status = msg.inputs[2];
		}

		if ("outputs" in msg) {
			this.selectedDevice.deviceStatus[2].params[0].status = msg.outputs[0];
			this.selectedDevice.deviceStatus[2].params[1].status = msg.outputs[1];
			this.selectedDevice.deviceStatus[2].params[2].status = msg.outputs[2];
		}

		if (topic.startsWith("anaInValue")) {
			if (topic.endsWith("[0]")) {
				this.selectedDevice.deviceStatus[1].params[0].status = msg.value;
			}
			if (topic.endsWith("[1]")) {
				this.selectedDevice.deviceStatus[1].params[1].status = msg.value;
			}
			if (topic.endsWith("[2]")) {
				this.selectedDevice.deviceStatus[1].params[2].status = msg.value;
			}
		}

		if (topic.startsWith("anaOutValue")) {
			if (topic.endsWith("[0]")) {
				this.selectedDevice.deviceStatus[2].params[0].status = msg.value;
			}
			if (topic.endsWith("[1]")) {
				this.selectedDevice.deviceStatus[2].params[1].status = msg.value;
			}
			if (topic.endsWith("[2]")) {
				this.selectedDevice.deviceStatus[2].params[2].status = msg.value;
			}
		}

	}

	//this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.CONNECTIONWASLOST"));

	headerHandler(value: string): void {
		switch (value) {
			case "goBack":
				if (this.prevPageName === "main-page") {
					this.router.navigate(["/main/main-dashboard"]);
				} else {
					this.router.navigate(["/main/group-details", this.selectedDevice.groupId]);
				}
				break;
			case "Move to group":
				this.showMoveDeviceModal();
				break;
			case "Edit device":
				this.router.navigate(["/main/edit-device", this.selectedDevice.id]);
				break;
			case "Delete":
				this.showConfirmDeleteModal();
				break;
			default:
				break;
		}
	}

	showMoveDeviceModal(): void {
		this.modalSvc.moveDeviceToGroup({groupId: this.selectedDevice.groupId}, (res: DeviceModel) => {
			if (res) {
				const currentGroup = this.groupActionsSvc.getGroupById(+res.id);
				this.selectedDevice = this.deviceActionsSvc.moveDeviceAction(this.selectedDevice, currentGroup);
				this.selectedDevice.groupPassword = res.password;
				this.selectedDevice.groupUsername = res.username;
				this.deviceActionsSvc.updateOrRemoveDeviceInGroup(this.selectedDevice, "remove");
				this.selectedDevice.groupId = res.id;
				this.deviceActionsSvc.addDeviceInGroup(this.selectedDevice, res.id);
				this.headerConfig.headerTitle = this.selectedDevice.name;
			}
		});
	}

	showConfirmDeleteModal(): void {
		this.modalSvc.showDefaultConfirmModal({
			titleText: `${this.translate.instant("CONTENT.CONFIRMDELETEDEVICE")} ${this.selectedDevice.name}?`,
			contentText: "",
			cancelBtnText: this.translate.instant("CONTENT.CANCEL"),
			submitBtnText: this.translate.instant("CONTENT.DELETE")
		}, (res: DeviceModel) => {
			if (res) {
				this.deviceActionsSvc.updateOrRemoveDeviceInGroup(this.selectedDevice, "remove");
				this.router.navigate(["/main/main-dashboard"]);
			}
		});
	}

	saveCheckboxDevice(item: any, index: number, rowIndex: number): void {

		const topic = "devices/" + this.selectedDevice.uidIdentifier + "/digOutSet[" + index + "]";
		const value = (1 - item.status).toString() + "";

		console.log("Sent: " + topic + ":" + value);

		this.client.publish(topic, value, () => {});
	}

	elementCannotBeChanged() {
		// element clicked which cannot be changed
	}


	editAnalogItem(device: DeviceModel, itemTitle: string, analogIndex: number, type: string): void {
		this.modalSvc.showDefaultActionsModal({
			componentType: type,
			item: device,
			title: itemTitle,
			description: `${this.translate.instant("CONTENT.CHANNEL")} ${analogIndex + 1}`,
		}, (res: DeviceModel) => {
			if (res) {
				const topic = "devices/" + this.selectedDevice.uidIdentifier + "/anaOutSet[" + analogIndex + "]";

				this.client.publish(topic, res.counter + "", () => {});
	
			}
		});
	}

	ionViewWillLeave() {
		this.client.end();
		this.selectedDevice.deviceStatus[0].connectionState.status = false;
		this.deviceActionsSvc.updateOrRemoveDeviceInGroup(this.selectedDevice, "update");
	}
}
