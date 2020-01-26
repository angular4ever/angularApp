import { NgModule } from "@angular/core";

import {
	MatListModule,
	MatMenuModule,
	MatIconModule,
	MatCheckboxModule,
	MatDialogModule,
	MatButtonModule,
	MatInputModule,
	MatOptionModule,
	MatSelectModule,
	MatTabsModule,
	MatRadioModule
} from "@angular/material";

@NgModule({
	declarations: [],
	imports: [
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatCheckboxModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatTabsModule,
		MatRadioModule
	],
	exports: [
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatCheckboxModule,
		MatDialogModule,
		MatButtonModule,
		MatInputModule,
		MatOptionModule,
		MatSelectModule,
		MatTabsModule,
		MatRadioModule
	],
})
export class MaterialModule {
}
