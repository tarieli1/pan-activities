import { NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { Calendar } from '@ionic-native/calendar';

import { config } from '../config';
import {
  CsvService,
  EmailService,
  ToasterService,
  UtilsService,
  PushService,
  CalendarService,
} from './services';
import {
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  UserProvider,
  UserActivitiesProvider,
  ActivitiesExpirationProvider,
} from './providers';

const SERVICES = [
  CsvService,
  EmailService,
  ToasterService,
  UtilsService,
  PushService,
  CalendarService,
];

const PROVIDERS = [
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  UserProvider,
  UserActivitiesProvider,
  ActivitiesExpirationProvider,
  Calendar,
  File,
  EmailComposer,
];

@NgModule({
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config.firebaseConfig),
  ],
  providers: [
    ...SERVICES,
    ...PROVIDERS,
  ],
})
export class CoreModule {}