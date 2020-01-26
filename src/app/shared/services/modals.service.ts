import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material";

import { DefaultConfirmModalComponent } from "@app/shared/components/modals/default-confirm-modal/default-confirm-modal.component";
import { AddOrEditGroupModalComponent } from "@app/shared/components/modals/add-or-edit-group-modal/add-or-edit-group-modal.component";
import {
	MoveDeviceToGroupModalComponent
} from "@app/shared/components/modals/move-device-to-group-modal/move-device-to-group-modal.component";
import { DefaultActionsModalComponent } from "@app/shared/components/modals/default-actions-modal/default-actions-modal.component";

@Injectable()
export class ModalsService {

	constructor(public dialog: MatDialog) {
	}

	showDefaultConfirmModal(params: any = {}, afterClosed: Function = () => {
	}) {
		const configModal = {
			data: {
				params: params
			}
		};
		const dialogRef = this.dialog.open(DefaultConfirmModalComponent, configModal);
		dialogRef.afterClosed().subscribe(result => {
			if (afterClosed) {
				afterClosed(result);
			}
		});
	}

	showDefaultActionsModal(params: any = {}, afterClosed: Function = () => {
	}) {
		const configModal = {
			data: {
				params: params
			}
		};
		const dialogRef = this.dialog.open(DefaultActionsModalComponent, configModal);
		dialogRef.afterClosed().subscribe(result => {
			if (afterClosed) {
				afterClosed(result);
			}
		});
	}

	addOrEditGroup(params: any = {}, afterClosed: Function = () => {
	}) {
		const configModal = {
			width: "80vw",
			data: {
				params: params.item,
				type: params.type
			}
		};
		const dialogRef = this.dialog.open(AddOrEditGroupModalComponent, configModal);
		dialogRef.afterClosed().subscribe(result => {
			if (afterClosed) {
				afterClosed(result);
			}
		});
	}

	moveDeviceToGroup(params: any = {}, afterClosed: Function = () => {
	}) {
		const configModal = {
			data: params
		};
		const dialogRef = this.dialog.open(MoveDeviceToGroupModalComponent, configModal);
		dialogRef.afterClosed().subscribe(result => {
			if (afterClosed) {
				afterClosed(result);
			}
		});
	}
}
