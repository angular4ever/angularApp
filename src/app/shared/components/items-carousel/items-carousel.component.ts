import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { DeviceModel } from "@app/shared/models/device.model";

@Component({
	selector: "app-items-carousel",
	templateUrl: "./items-carousel.component.html",
	styleUrls: ["./items-carousel.component.scss"]
})
export class ItemsCarouselComponent implements OnInit {

	// carousel with items. Unused
	@Input() itemsArr: Array<DeviceModel>;
	@Output() private selectedItem = new EventEmitter<DeviceModel>();

	constructor() {
	}

	ngOnInit() {
	}

	clickedItem(item: DeviceModel): void {
		this.selectedItem.emit(item);
	}
}
