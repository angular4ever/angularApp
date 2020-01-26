import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";

import { GroupDevicesModel } from "@app/shared/models/group-devices.model";
import { MoveDeviceToGroupDataModel } from "@app/shared/models/move-device-to-group-data.model";
import { ToastrActionsService } from "@app/shared/services/toastr-actions.service";
import { GroupActionsService } from "@app/shared/services/group-actions.service";

@Component({
	selector: "app-move-device-to-group-modal",
	templateUrl: "./move-device-to-group-modal.component.html",
	styleUrls: ["./move-device-to-group-modal.component.scss"],
})
export class MoveDeviceToGroupModalComponent implements OnInit {

	allGroups: Array<GroupDevicesModel>;

	constructor(@Inject(MAT_DIALOG_DATA) private data: MoveDeviceToGroupDataModel,
				private dialogRef: MatDialogRef<MoveDeviceToGroupModalComponent>,
				private translate: TranslateService,
				private toastrActionsSvc: ToastrActionsService,
				private groupActionsSvc: GroupActionsService) {
	}

	ngOnInit() {
		this.allGroups = this.groupActionsSvc.getGroups();
	}

	moveDevice(group: any): void {
		if (typeof group === "undefined") {
			this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.SELECTGROUP"));
		} else if (+this.data.groupId === +group.id) {
			this.toastrActionsSvc.showToastr("warning", this.translate.instant("CONTENT.DEVICEALREADYINTHISGROUP"));
		} else {
			this.dialogRef.close(group);
		}
	}
}
