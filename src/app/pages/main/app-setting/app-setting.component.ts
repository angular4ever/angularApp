import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";
import { UserDataModel } from "@app/shared/models/user-data.model";
import { TranslateLanguagesModel } from "@app/shared/models/translate-languages.model";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { UserService } from "@app/shared/services/user.service";
import { UtilsService } from "@app/shared/services/utils.service";
import { DefaultHeaderComponent } from "@app/shared/components/default-header/default-header.component";

@Component({
	selector: "app-setting",
	templateUrl: "app-setting.component.html",
	styleUrls: ["app-setting.component.scss"],
	encapsulation: ViewEncapsulation.None
})

export class AppSettingComponent implements OnInit {

	@ViewChild(DefaultHeaderComponent, {static: false}) child: DefaultHeaderComponent;

	headerConfig: DefaultHeaderConfigModel;
	availableLanguages: TranslateLanguagesModel[] = this.componentsConfigSvc.getTranslateLanguage();
	userData: UserDataModel;
	selectedLanguage: TranslateLanguagesModel;

	constructor(private componentsConfigSvc: ComponentsConfigsService,
				private router: Router,
				private translate: TranslateService,
				private userSvc: UserService,
				private utilsSvc: UtilsService) {
	}

	ngOnInit() {
		this.headerConfig = this.componentsConfigSvc.getSettingPageHeaderConfig();
		this.initLanguage();
	}

	ionWillEnter() {
		this.initLanguage();
	}

	initLanguage(): void {
		this.userData = this.userSvc.getUserDataFromStorage() || {};
		const index = this.utilsSvc.getElementIndexByKey(this.availableLanguages, "shortName", this.userData.language);
		this.selectedLanguage = this.availableLanguages[index];
	}

	headerHandler(value: string): void {
		if (value === "goBack") {
			this.router.navigate(["/main/main-dashboard/"]);
		}
	}

	changeLanguage(item: TranslateLanguagesModel): void {
		this.translate.use(item.shortName);
		this.userData.language = item.shortName;
		this.userSvc.setUserDataInStorage(this.userData);
		this.child.updateTitle();
	}
}
