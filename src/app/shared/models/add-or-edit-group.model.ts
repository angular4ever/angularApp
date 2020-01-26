import { GroupDevicesModel } from "@app/shared/models/group-devices.model";

export interface AddOrEditGroupModel {
	params: GroupDevicesModel;
	type: string;
}
