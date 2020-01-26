import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Network } from "@ionic-native/network/ngx";
import { LoadingController } from "@ionic/angular";

import { DeviceModel } from "@app/shared/models/device.model";
import { DefaultConfirmModel } from "@app/shared/models/default-confirm.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";

@Injectable()
export class BrokerActionsService {

	constructor(private translate: TranslateService,
				private network: Network,
				public loadingController: LoadingController,
				private toastrActionsSvc: ToastrActionsService) {
	}

	client: any;

	async checkConnectionToBroker(device: DeviceModel): Promise<DefaultConfirmModel> {
		await this.showLoadingModal();
		return new Promise((resolve) => {
			if (this.network.type === "none") {
				resolve({status: false, type: "no network"});
			}
			const randomId = +new Date();
			const options = {
				username: device.isUseGroupLogin ? device.groupUsername : device.username,
				password: device.isUseGroupLogin ? device.groupPassword : device.password,
				clientId: randomId.toString(),
				keepAlive: 180
			};
			this.client = (window as any).mqtt.connect(`ws://${device.uriIdentifier}:15675/ws`, options);
			this.client.on("connect", () => {
				resolve({status: true});
				this.client.end();
				this.loadingController.dismiss();
			});
			this.client.stream.on("error", () => {
				resolve({status: false, type: "wrong url"});
				this.client.end();
				this.loadingController.dismiss();
			});
			this.client.on("close", () => {
				resolve({status: false, type: "incorrect credentials"});
				this.client.end();
				this.loadingController.dismiss();
			});
		});
	}

	async showLoadingModal(): Promise<any> {
		const loading = await this.loadingController.create({
			duration: 5000,
			message: "Checking connection...",
			translucent: true,
			cssClass: "custom-class custom-loading"
		});
		return await loading.present();
	}

	showErrorToastr(type: string, itemName: string = ""): void {
		switch (type) {
			case "no network":
				this.toastrActionsSvc.showToastr("error", `${this.translate.instant("CONTENT.NONETWORKCONNECTION")}
				${itemName}`);
				break;
			case "wrong url":
				this.toastrActionsSvc.showToastr("error", `${this.translate.instant("CONTENT.WRONGURL")}
				in ${itemName} device`);
				break;
			case "incorrect credentials":
				this.toastrActionsSvc.showToastr("error", `${this.translate.instant("CONTENT.WRONGCREDENTIALS")}
				${itemName}`);
				break;
			default:
				this.toastrActionsSvc.showToastr("error", `${this.translate.instant("CONTENT.CONNECTIONPROBLEM")}
				${itemName}`);
				break;
		}
	}
}
