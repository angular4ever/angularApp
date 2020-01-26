import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";

import { MaterialModule } from "@app/shared/material.module";
import { ComponentsModule } from "@app/shared/components/components.module";
import { ServicesModule } from "@app/shared/services/services.module";

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		MaterialModule,
		ComponentsModule,
		ServicesModule
	],
	exports: [
		ComponentsModule,
		ServicesModule
	]
})
export class SharedModule {
}
