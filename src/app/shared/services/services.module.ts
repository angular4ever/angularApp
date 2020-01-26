import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UtilsService } from "@app/shared/services/utils.service";
import { DeviceActionsService } from "@app/shared/services/device-actions.service";
import { MainValidationService } from "@app/shared/services/validation.service";
import { ModalsService } from "@app/shared/services/modals.service";
import { ComponentsConfigsService } from "@app/shared/services/components-configs.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { BrokerActionsService } from "@app/shared/services/broker-actions.service";
import { UserService } from "@app/shared/services/user.service";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { AppService } from "@app/shared/services/app.service";

@NgModule({
	imports: [
		CommonModule
	],
	exports: [],
	providers: [
		UtilsService,
		DeviceActionsService,
		MainValidationService,
		ModalsService,
		ComponentsConfigsService,
		GroupActionsService,
		BrokerActionsService,
		UserService,
		ToastrActionsService,
		AppService
	]
})
export class ServicesModule {
}
