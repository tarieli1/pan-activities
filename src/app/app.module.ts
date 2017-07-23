import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Push } from '@ionic-native/push';

import { PanActivitiesComponent } from './app.component';
import {
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
  PendingUsersComponent,
  PublishActivitiesComponent,
} from '../pages';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

const COMPONENTS = [
  PanActivitiesComponent,
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
  PendingUsersComponent,
  PublishActivitiesComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CoreModule,
    SharedModule,
    IonicModule.forRoot(PanActivitiesComponent, { backButtonText: '' }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ...COMPONENTS,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
  ]
})
export class AppModule {}
