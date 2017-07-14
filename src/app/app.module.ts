import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { config } from '../config';
import { CoreModule } from '../core/core.module';
import { PanActivitiesComponent } from './app.component';
import {
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
} from '../pages';
import { AuthGuard, CamelCasePipe } from '../shared';

const COMPONENTS = [
  PanActivitiesComponent,
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    CamelCasePipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    CoreModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config.firebaseConfig),
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
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthGuard,
    CamelCasePipe,
  ]
})
export class AppModule {}
