import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { ProfileTypesModel } from "@app/shared/models/profile-types.model";
import { TranslateLanguagesModel } from "@app/shared/models/translate-languages.model";

@Injectable()
export class ComponentsConfigsService {

	constructor(private translate: TranslateService) {
	}

	getMainPageMenuConfig(): DefaultHeaderConfigModel {
		return {
			iconName: "menu",
			headerTitle: "IDC DASHBOARD",//`IDC ${this.translate.instant("CONTENT.GROUPS")}`,
			hideBackBtn: true,
			showLogo: true,
			menuActionList: [
				{
					name: this.translate.instant("CONTENT.ABOUT"),
					value: "About"
				},
				{
					name: this.translate.instant("CONTENT.SETTINGS"),
					value: "Settings"
				},
				{
					name: this.translate.instant("CONTENT.EXIT"),
					value: "Exit"
				}
			]
		};
	}

	getSettingPageHeaderConfig(): DefaultHeaderConfigModel {
		return {
			headerTitle: this.translate.instant("CONTENT.SETTINGS"),
		};
	}

	getGroupDetailsHeaderConfig(): DefaultHeaderConfigModel {
		return {
			iconName: "settings",
			menuActionList: [
				{
					name: this.translate.instant("CONTENT.EDITGROUP"),
					value: "Edit group"
				},
				{
					name: this.translate.instant("CONTENT.DELETE"),
					value: "Delete"
				}
			]
		};
	}

	getDeviceMenuConfig(): DefaultHeaderConfigModel {
		return {
			iconName: "settings",
			menuActionList: [
				{
					name: this.translate.instant("CONTENT.MOVETOGROUP"),
					value: "Move to group"
				},
				{
					name: this.translate.instant("CONTENT.EDITDEVICE"),
					value: "Edit device"
				},
				{
					name: this.translate.instant("CONTENT.DELETE"),
					value: "Delete"
				}
			]
		};
	}

	getDeviceProfileTypes(): Array<ProfileTypesModel> {
		return [
			{
				key: 0,
				title: "Digital I/O",
				logo: "../../../../assets/images/Profile1_DIO_Icon.png"
			},
			{
				key: 1,
				title: "Analog I/O",
				logo: "../../../../assets/images/Profile2_AIO_Icon.png"
			},
			{
				key: 2,
				title: "Dynamic",
				logo: "../../../../assets/images/Profile3_Dynamic_Icon.png"
			}
		];
	}

	getTranslateLanguage(): Array<TranslateLanguagesModel> {
		return [
			{value: 0, iconLink: "../../../../assets/icons/english_flag.svg", shortName: "en"},
			{value: 1, iconLink: "../../../../assets/icons/german_flag.svg", shortName: "de"}
		];
	}
}
