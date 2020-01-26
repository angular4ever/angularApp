import { DeviceStatusModel } from "@app/shared/models/device-status.model";
import { ProfileTypesModel } from "@app/shared/models/profile-types.model";

export interface DeviceModel {
	id?: number;
	name?: string;
	username?: string;
	password?: string;
	isUseGroupLogin?: boolean;
	favorite?: boolean;
	type?: string;
	profileType?: ProfileTypesModel;
	uidIdentifier?: string;
	uriIdentifier?: string;
	deviceLogoLink?: string;
	deviceStatus?: Array<DeviceStatusModel>;
	groupId?: number;
	groupPassword?: string;
	groupUsername?: string;
	status?: boolean;
	counter?:number;	
}
