import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { config } from '../config';
import {
  UserProvider,
  UserActivitiesProvider,
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  CsvService,
  UtilsService,
  EmailService,
} from '../providers';

import { PanActivitiesComponent } from './app.component';
import {
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
} from '../pages';
import { AuthGuard, ToasterService, CamelCasePipe } from '../shared';

@NgModule({
  declarations: [
    PanActivitiesComponent,
    ActivitiesComponent,
    ActivityComponent,
    MyActivitiesComponent,
    LoginComponent,
    AddActivityComponent,
    CamelCasePipe,
  ],
  imports: [
    BrowserModule,
    HttpModule,
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
    PanActivitiesComponent,
    ActivitiesComponent,
    ActivityComponent,
    MyActivitiesComponent,
    LoginComponent,
    AddActivityComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserProvider,
    UserActivitiesProvider,
    ActivitiesProvider,
    PendingUserActivitiesProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ToasterService,
    AuthGuard,
    CamelCasePipe,
    File,
    EmailComposer,
    CsvService,
    UtilsService,
    EmailService,
  ]
})
export class AppModule {}
