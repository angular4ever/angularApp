import { Injectable } from "@angular/core";

import { GroupDevicesModel } from "@app/shared/models/group-devices.model";

@Injectable()
export class GroupActionsService {

	constructor() {
	}

	updateOrRemoveGroup(group: GroupDevicesModel, type: string): void {
		const groups = this.getGroups();
		if (type === "update") {
			groups.splice(groups.findIndex(item => item.id === group.id), 1, group);
		} else if (type === "remove") {
			groups.splice(groups.findIndex(item => item.id === group.id), 1);
		}
		this.saveGroup(groups);
	}

	getGroupById(groupId: number): GroupDevicesModel {
		const groups = this.getGroups();
		return groups.find(group => group.id === +groupId);
	}

	checkUniqueGroupName(name: string, groupId: number = null): boolean {
		const groups = this.getGroups() || [];
		return groups.some(group => group.name === name && group.id !== groupId);
	}

	saveGroup(groups: GroupDevicesModel[]): void {
		localStorage.setItem("groups", JSON.stringify(groups));
	}

	getGroups(): GroupDevicesModel[] {
		return JSON.parse(localStorage.getItem("groups"));
	}

	setGroupInStorage(id: number): void {
		sessionStorage.setItem("groupId", JSON.stringify(id));
	}

	getGroupIdFromStorage(): string {
		return JSON.parse(sessionStorage.getItem("groupId"));
	}
}
