import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { IonicModule } from "@ionic/angular";

import { MainRoutingModule } from "@app/pages/main/main-routing.module";
import { SharedModule } from "@app/shared/shared.module";
import { MaterialModule } from "@app/shared/material.module";
import { MainComponent } from "@app/pages/main/main.component";
import { MainDashboardComponent } from "@app/pages/main/main-dashboard/main-dashboard.component";
import { GroupDetailsComponent } from "@app/pages/main/group-details/group-details.component";
import { DeviceDetailsComponent } from "@app/pages/main/device-details/device-details.component";
import { EditDeviceComponent } from "@app/pages/main/edit-device/edit-device.component";
import { AddDeviceComponent } from "@app/pages/main/add-device/add-device.component";
import { AppSettingComponent } from "@app/pages/main/app-setting/app-setting.component";

@NgModule({
	declarations: [
		MainComponent,
		MainDashboardComponent,
		GroupDetailsComponent,
		DeviceDetailsComponent,
		EditDeviceComponent,
		AddDeviceComponent,
		AppSettingComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		TranslateModule,
		RoundProgressModule,
		IonicModule,
		MainRoutingModule,
		SharedModule,
		MaterialModule
	],
	exports: [
		MainComponent,
		MainDashboardComponent,
		GroupDetailsComponent,
		DeviceDetailsComponent,
		EditDeviceComponent,
		AddDeviceComponent,
		AppSettingComponent
	]
})
export class MainModule {
}
