import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
	selector: "app-default-fab",
	templateUrl: "./default-fab.component.html",
	styleUrls: ["./default-fab.component.scss"],
})
export class DefaultFabComponent implements OnInit {

	@Output() private clickOnFab = new EventEmitter<string>();

	constructor() {
	}

	ngOnInit() {
	}

	clickOnBtn(): void {
		this.clickOnFab.emit();
	}
}
