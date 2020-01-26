import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MainComponent } from "@app/pages/main/main.component";
import { MainDashboardComponent } from "@app/pages/main/main-dashboard/main-dashboard.component";
import { DeviceDetailsComponent } from "@app/pages/main/device-details/device-details.component";
import { GroupDetailsComponent } from "@app/pages/main/group-details/group-details.component";
import { EditDeviceComponent } from "@app/pages/main/edit-device/edit-device.component";
import { AddDeviceComponent } from "@app/pages/main/add-device/add-device.component";
import { AppSettingComponent } from "@app/pages/main/app-setting/app-setting.component";

// don't forget add route in app.component (reassignment back button behavior)
const routes: Routes = [
	{
		path: "main",
		component: MainComponent,
		children: [
			{
				path: "main-dashboard",
				component: MainDashboardComponent
			},
			{
				path: "device-details/:id",
				component: DeviceDetailsComponent
			},
			{
				path: "group-details/:id",
				component: GroupDetailsComponent
			},
			{
				path: "edit-device/:id",
				component: EditDeviceComponent
			},
			{
				path: "add-device/:id",
				component: AddDeviceComponent
			},
			{
				path: "setting",
				component: AppSettingComponent
			}
		]
	}
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [RouterModule]
})
export class MainRoutingModule {
}
