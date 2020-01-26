import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { DeviceModel } from "@app/shared/models/device.model";
import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { DeviceStatusModel } from "@app/shared/models/device-status.model";
import { GroupAndDeviceModel } from "@app/shared/models/group-and-device.model";
import { GroupActionsService } from "@app/shared/services/group-actions.service";

@Injectable()
export class DeviceActionsService {

	deviceDefaultConfig = [
		{
			key: 0,
			title: "deviceInfo",
			data: {
				title: this.translate.instant("CONTENT.DEVICESTATUS"),
				type: "deviceStatus",
				connectionState: {
					title: this.translate.instant("CONTENT.CONNECTIONSTATE"),
					status: false
				},
				uptime: {
					title: this.translate.instant("CONTENT.UPTIME"),
					timeInWork: ["0"]
				},
				temperature: {
					title: this.translate.instant("CONTENT.TEMPERATURE"),
					temp: 10
				}
			}
		},
		{
			key: 1,
			title: "Digital Inputs",
			data: {
				title: this.translate.instant("CONTENT.DIGITALINPUTS"),
				type: "digitalInputChannels",
				params: [
					{
						status: false
					},
					{
						status: false
					},
					{
						status: false
					}
				]
			}
		},
		{
			key: 2,
			title: "Digital Outputs",
			data: {
				title: this.translate.instant("CONTENT.DIGITALOUTPUTS"),
				type: "digitalOutputChannels",
				params: [
					{
						status: 0
					},
					{
						status: 0
					},
					{
						status: 0
					}
				]
			}
		},
		{
			key: 3,
			title: "Analog Inputs",
			data: {
				title: this.translate.instant("CONTENT.ANALOGINPUTS"),
				type: "analogInputsChannels",
				params: [
					{
						counter: 30,
						type: "temperature"
					},
					{
						counter: 6
					},
					{
						counter: 4
					}
				]
			}
		},
		{
			key: 4,
			title: "Analog Outputs",
			data: {
				title: this.translate.instant("CONTENT.ANALOGOUTPUTS"),
				type: "analogOutputsChannels",
				params: [
					{
						counter: 0,
						maxCount: 5,
						type: "circle"
					},
					{
						counter: 0,
						maxCount: 10,
						type: "circle"
					},
					{
						counter: 0,
						maxCount: 3,
						type: "circle-radio"
					}
				]
			}
		},
		{
			key: 5,
			title: "Digital Outputs",
			data: {
				title: this.translate.instant("CONTENT.DIGITALOUTPUTS"),
				type: "digitalOutputChannels",
				params: [
					{
						status: 0
					},
					{
						status: 0
					},
					{
						status: 0
					}
				]
			}
		},
	];

	constructor(private translate: TranslateService,
				private groupActionsSvc: GroupActionsService) {
	}

	getFavouritesDevices(): DeviceModel[] {
		const groups = this.groupActionsSvc.getGroups();
		const favoritesDevices = [];
		if (groups) {
			groups.forEach(group => {
				group.devices.forEach(device => {
					if (device.favorite) {
						favoritesDevices.push(device);
					}
				});
			});
		}
		return favoritesDevices;
	}

	addDeviceInGroup(device: DeviceModel, groupId: number): void {
		const groups = this.groupActionsSvc.getGroups();
		const selectedGroup = groups.find(group => group.id === groupId);
		if (!device.id) {
			device.id = +new Date();
			device.deviceStatus = this.setDeviceType(device.profileType.key);
			device.groupId = groupId;
			device.favorite = false;
			device.type = "device";
		}
		selectedGroup.devices.push(device);
		this.groupActionsSvc.saveGroup(groups);
	}

	setDeviceType(deviceType: number): DeviceStatusModel[] {
		const deviceTypeConfig = [];
		deviceTypeConfig.push(this.deviceDefaultConfig[0].data);
		switch (deviceType) {
			case 0:
				deviceTypeConfig.push(this.deviceDefaultConfig[1].data);
				deviceTypeConfig.push(this.deviceDefaultConfig[2].data);
				break;
			case 1:
				deviceTypeConfig.push(this.deviceDefaultConfig[3].data);
				deviceTypeConfig.push(this.deviceDefaultConfig[4].data);
				break;
			case 2:
				deviceTypeConfig.push(this.deviceDefaultConfig[5].data);
				break;
			default:
				break;
		}
		return deviceTypeConfig;
	}

	updateOrRemoveDeviceInGroup(device: DeviceModel, type: string): void {
		const groups = this.groupActionsSvc.getGroups();
		const selectedGroup = groups.find(group => group.id === device.groupId);
		const index = selectedGroup.devices.findIndex(item => item.id === device.id);
		if (index === -1) {
			return;
		}
		if (type === "update") {
			selectedGroup.devices.splice(index, 1, device);
		} else if (type === "remove") {
			selectedGroup.devices.splice(index, 1);
		}
		this.groupActionsSvc.saveGroup(groups);
	}

	getDeviceInGroup(deviceId: number): GroupAndDeviceModel {
		const groups = this.groupActionsSvc.getGroups();
		for (let i = 0; i < groups.length; i++) {
			for (let j = 0; j < groups[i].devices.length; j++) {
				if (+groups[i].devices[j].id === deviceId) {
					return {
						group: groups[i],
						device: groups[i].devices[j]
					};
				}
			}
		}
	}

	checkUniqueDeviceName(groupId: number, deviceName: string, deviceId: number = null): boolean {
		const groups = this.groupActionsSvc.getGroups();
		let result = true;
		groups.forEach(group => {
			if (group.id === groupId) {
				group.devices.forEach(device => {
					if (device.id !== deviceId && device.name === deviceName) {
						result = false;
					}
				});
			}
		});
		return result;
	}

	moveDeviceAction(device: DeviceModel, currentGroup: GroupDevicesModel): DeviceModel {
		const outputDevice = device;
		currentGroup.devices.forEach(item => {
			if (item.name === outputDevice.name) {
				outputDevice.name = `${device.name} (copy)`;
			}
		});
		return outputDevice;
	}

	setDeviceInStorage(id: string): void {
		sessionStorage.setItem("deviceId", id);
	}

	getDeviceIdFromStorage(): string {
		return sessionStorage.getItem("deviceId");
	}
}
