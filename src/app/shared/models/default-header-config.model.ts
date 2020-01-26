import { DefaultMenuModel } from "@app/shared/models/default-menu.model";

export interface DefaultHeaderConfigModel {
	headerTitle?: string;
	hideBackBtn?: boolean;
	hideMenu?: boolean;
	iconName?: string;
	menuActionList?: Array<DefaultMenuModel>;
	showLogo?: boolean;
	groupName?: string;
	iconColor?: string;
	smallerText?: boolean;
}
