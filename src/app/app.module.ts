import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { Push } from '@ionic-native/push';
import { EmailComposer } from '@ionic-native/email-composer';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import {
  UserProvider,
  UserActivitiesProvider,
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  CsvService,
  UtilsService,
  EmailService,
  PushService,
} from '../providers';

import { MyApp } from './app.component';
import {
  ActivitiesComponent,
  ActivityComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
} from '../pages';
import { AuthGuard, ToasterService } from '../shared';

const firebaseConfig = {
  apiKey: "AIzaSyC5nxjllDIqq_zoi5u7X3tMiTeoB-lSIaQ",
  authDomain: "pan-activities.firebaseapp.com",
  databaseURL: "https://pan-activities.firebaseio.com",
  projectId: "pan-activities",
  storageBucket: "pan-activities.appspot.com",
  messagingSenderId: "425195188130"
};

@NgModule({
  declarations: [
    MyApp,
    ActivitiesComponent,
    ActivityComponent,
    MyActivitiesComponent,
    LoginComponent,
    AddActivityComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
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
    File,
    EmailComposer,
    CsvService,
    UtilsService,
    EmailService,
    Push,
    PushService,
  ]
})
export class AppModule {}
