import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { DeviceModel } from "@app/shared/models/device.model";

export interface GroupAndDeviceModel {
	group: GroupDevicesModel;
	device: DeviceModel;
}
