import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslateModule } from "@ngx-translate/core";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { MaterialModule } from "@app/shared/material.module";
import { DefaultItemsListComponent } from "@app/shared/components/default-items-list/default-items-list.component";
import { DefaultMenuComponent } from "@app/shared/components/default-menu/default-menu.component";
import { DefaultHeaderComponent } from "@app/shared/components/default-header/default-header.component";
import { AddOrEditGroupModalComponent } from "@app/shared/components/modals/add-or-edit-group-modal/add-or-edit-group-modal.component";
import { DefaultConfirmModalComponent } from "@app/shared/components/modals/default-confirm-modal/default-confirm-modal.component";
import {
	MoveDeviceToGroupModalComponent
} from "@app/shared/components/modals/move-device-to-group-modal/move-device-to-group-modal.component";
import { ItemsCarouselComponent } from "@app/shared/components/items-carousel/items-carousel.component";
import { DefaultFabComponent } from "@app/shared/components/default-fab/default-fab.component";
import { DefaultActionsModalComponent } from "@app/shared/components/modals/default-actions-modal/default-actions-modal.component";

@NgModule({
	declarations: [
		DefaultItemsListComponent,
		DefaultMenuComponent,
		DefaultHeaderComponent,
		AddOrEditGroupModalComponent,
		DefaultConfirmModalComponent,
		MoveDeviceToGroupModalComponent,
		ItemsCarouselComponent,
		DefaultFabComponent,
		DefaultActionsModalComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		FlexLayoutModule,
		TranslateModule,
		RoundProgressModule,
		MaterialModule
	],
	exports: [
		DefaultItemsListComponent,
		DefaultMenuComponent,
		DefaultHeaderComponent,
		DefaultConfirmModalComponent,
		AddOrEditGroupModalComponent,
		MoveDeviceToGroupModalComponent,
		ItemsCarouselComponent,
		DefaultFabComponent,
		DefaultActionsModalComponent
	],
	entryComponents: [
		DefaultConfirmModalComponent,
		AddOrEditGroupModalComponent,
		MoveDeviceToGroupModalComponent,
		DefaultActionsModalComponent
	]
})
export class ComponentsModule {
}
