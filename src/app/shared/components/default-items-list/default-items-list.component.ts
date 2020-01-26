import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { GroupActionsService } from "@app/shared/services/group-actions.service";
import { DeviceModel } from "@app/shared/models/device.model";

@Component({
	selector: "app-default-items-list",
	templateUrl: "./default-items-list.component.html",
	styleUrls: ["./default-items-list.component.scss"],
})
export class DefaultItemsListComponent implements OnInit {

	@Input() itemsArr: any;
	@Input() favList: boolean;
	@Output() private selectedItem = new EventEmitter<any>();

	constructor(private groupActionsSvc: GroupActionsService) {
	}

	ngOnInit() {
	}

	clickedItem(item: DeviceModel, type: string): void {
		event.stopPropagation();
		item.type = type;
		this.selectedItem.emit(item);
	}

	dragItems(event: any): void {
		const draggedItem = this.itemsArr.splice(event.detail.from, 1)[0];
		const isDevice = this.itemsArr[0].hasOwnProperty("deviceStatus");
		this.itemsArr.splice(event.detail.to, 0, draggedItem);
		if (isDevice) {
			this.saveDevicesList(draggedItem);
			// retake items because ion-reorder crashed ios-sliding
			this.itemsArr = this.groupActionsSvc.getGroupById(draggedItem.groupId).devices;
		} else if (!isDevice) {
			this.groupActionsSvc.saveGroup(this.itemsArr);
			// retake items because ion-reorder crashed ios-sliding
			this.itemsArr = this.groupActionsSvc.getGroups();
			this.selectedItem.emit({type: "updateData"});
		}
		event.detail.complete();
	}

	saveDevicesList(draggedItem: DeviceModel): void {
		const allGroups = this.groupActionsSvc.getGroups();
		const groupIndex = allGroups.findIndex(item => item.id === draggedItem.groupId);
		const currentGroup = allGroups[groupIndex];
		currentGroup.devices = this.itemsArr;
		this.groupActionsSvc.saveGroup(allGroups);
	}
}
