import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ToastrModule } from "ngx-toastr";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { Network } from "@ionic-native/network/ngx";
import { AppVersion } from "@ionic-native/app-version/ngx";

import { AppComponent } from "@app/app.component";
import { AppRoutingModule } from "@app/app-routing.module";
import { CoreModule } from "@app/core/core.module";
import { SharedModule } from "@app/shared/shared.module";
import { MainModule } from "@app/pages/main/main.module";


export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [AppComponent],
	entryComponents: [],
	imports: [
		BrowserModule,
		IonicModule.forRoot(),
		BrowserAnimationsModule,
		ToastrModule.forRoot({
			maxOpened: 1
		}),
		HttpClientModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		FormsModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		AppRoutingModule,
		CoreModule,
		SharedModule,
		MainModule
	],
	providers: [
		SplashScreen,
		BarcodeScanner,
		Network,
		AppVersion,
		{
			provide: RouteReuseStrategy,
			useClass: IonicRouteStrategy
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
