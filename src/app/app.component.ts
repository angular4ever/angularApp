import { Component } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { DefaultConfirmModel } from "@app/shared/models/default-confirm.model";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { BrokerActionsService } from "@app/shared/services/broker-actions.service";
import { ModalsService } from "@app/shared/services/modals.service";
import { UserService } from "@app/shared/services/user.service";
import { AppService } from "@app/shared/services/app.service";

@Component({
	selector: "app-root",
	templateUrl: "app.component.html",
	styleUrls: ["app.component.scss"]
})
export class AppComponent {

	groupId: string;
	deviceId: string;
	previousUrl: string;

	constructor(private router: Router,
				private dialogRef: MatDialog,
				private toastr: ToastrService,
				private platform: Platform,
				private splashScreen: SplashScreen,
				private appVersion: AppVersion,
				private groupActionsSvc: GroupActionsService,
				private deviceActionsSvc: DeviceActionsService,
				private brokerActionsSvc: BrokerActionsService,
				private modalSvc: ModalsService,
				private translate: TranslateService,
				private userSvc: UserService,
				private appSvc: AppService
	) {
		this.initializeApp();
	}

	initializeApp(): void {
		this.useCurrentLanguage();
		this.platform.ready().then(() => {
			this.splashScreen.hide();
			this.platform.backButton.subscribeWithPriority(9999, () => {
				this.changeRoute();
			});
			this.savePreviousState();
			this.appVersion.getVersionNumber().then(res => {
				this.appSvc.setAppVersion(res);
			});
		});
	}

	savePreviousState(): void {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				const url = this.router.url;
				this.previousUrl = url.substr(url.indexOf("/"), url.indexOf("/" + 1));
			}
		});
	}

	useCurrentLanguage(): void {
		let currentLanguage;
		const userData = this.userSvc.getUserDataFromStorage() || {};
		if (userData.language) {
			currentLanguage = userData.language;
		} else {
			currentLanguage = "en";
			userData.language = "en";
			this.userSvc.setUserDataInStorage(userData);
		}
		this.translate.setDefaultLang(currentLanguage);
	}

	// reassignment back button behavior
	changeRoute(): void {
		if (this.router.url === "/main/main-dashboard") {
			this.showExitAppModal();
		}
		const routeLink = this.router.url.substr(0, this.router.url.indexOf("/" + 1));
		switch (routeLink) {
			case "/main/group-details":
				this.router.navigate(["/main/main-dashboard"]);
				break;
			case "/main/device-details":
				this.detailsDevicePageHandler();
				break;
			case "/main/add-device":
				this.groupId = this.groupActionsSvc.getGroupIdFromStorage();
				this.router.navigate(["/main/group-details", this.groupId]);
				break;
			case "/main/edit-device":
				this.editDevicePageHandler();
				break;
			default:
				break;
		}
	}

	showExitAppModal(): void {
		this.dialogRef.closeAll();
		this.modalSvc.showDefaultConfirmModal({
			titleText: "Do you want to exit the application?"
		}, (res: boolean) => {
			if (res) {
				navigator["app"].exitApp();
			}
		});
	}

	detailsDevicePageHandler(): void {
		this.groupId = this.groupActionsSvc.getGroupIdFromStorage();
		if (this.groupId) {
			this.router.navigate(["/main/group-details", this.groupId]);
		} else {
			this.router.navigate(["/main/main-dashboard"]);
		}
	}

	editDevicePageHandler(): void {
		this.groupId = this.groupActionsSvc.getGroupIdFromStorage();
		this.deviceId = this.deviceActionsSvc.getDeviceIdFromStorage();
		if (this.previousUrl === "/main/group-details") {
			this.router.navigate(["/main/group-details", this.groupId]);
		} else {
			const device = this.deviceActionsSvc.getDeviceInGroup(+this.deviceId).device;
			this.brokerActionsSvc.checkConnectionToBroker(device).then((res: DefaultConfirmModel) => {
				if (res.status) {
					this.router.navigate(["/main/device-details", this.deviceId]);
				} else if (!res.status) {
					this.brokerActionsSvc.showErrorToastr(res.type, device.name);
				}
			});
		}
	}
}
