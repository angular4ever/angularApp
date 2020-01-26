import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";

import { DefaultMenuModel } from "@app/shared/models/default-menu.model";
import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";

@Component({
	selector: "app-default-menu",
	templateUrl: "./default-menu.component.html",
	styleUrls: ["./default-menu.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class DefaultMenuComponent implements OnInit {

	@Input() menuConfig: DefaultHeaderConfigModel;
	@Output() private menuEvent = new EventEmitter<string>();

	itemsList: Array<DefaultMenuModel> = [];
	iconName: string;
	iconColor: string;

	constructor() {
	}

	ngOnInit() {
		this.loadData();
	}

	loadData(): void {
		this.itemsList = this.menuConfig.menuActionList;
		this.iconName = this.menuConfig.iconName;
		this.iconColor = this.menuConfig.iconColor || "#fff";
	}

	selectItem(itemName: string): void {
		this.menuEvent.emit(itemName);
	}
}
