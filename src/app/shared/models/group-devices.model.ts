import { DeviceModel } from "@app/shared/models/device.model";

export interface GroupDevicesModel {
	id?: number;
	name?: string;
	username?: string;
	password?: string;
	description?: string;
	type?: string;
	groupLogoLink?: string;
	devices?: Array<DeviceModel>;
}
