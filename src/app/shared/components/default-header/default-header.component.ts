import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { DefaultHeaderConfigModel } from "@app/shared/models/default-header-config.model";

@Component({
	selector: "app-default-header",
	templateUrl: "./default-header.component.html",
	styleUrls: ["./default-header.component.scss"],
})
export class DefaultHeaderComponent implements OnInit {

	@Input() headerConfig: DefaultHeaderConfigModel;
	@Output() private headerEvent = new EventEmitter<string>();

	constructor(private translate: TranslateService) {
	}

	ngOnInit() {
	}

	defaultMenuHandler(value: string): void {
		this.sendEvent(value);
	}

	goBack(): void {
		this.sendEvent("goBack");
	}

	sendEvent(eventName: string): void {
		this.headerEvent.emit(eventName);
	}

	updateTitle(): void {
		const currLang = this.translate.store.currentLang;
		if (currLang === "en") {
			this.headerConfig.headerTitle = "Setting";
		} else if (currLang === "de") {
			this.headerConfig.headerTitle = "die Einstellungen";
		}
	}
}
