import { NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';

import { config } from '../config';
import {
  CsvService,
  EmailService,
  ToasterService,
  UtilsService,
} from './services';
import {
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  UserProvider,
  UserActivitiesProvider,
} from './providers';

const SERVICES = [
  CsvService,
  EmailService,
  ToasterService,
  UtilsService,
];

const PROVIDERS = [
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  UserProvider,
  UserActivitiesProvider,
];

@NgModule({
  imports: [
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(config.firebaseConfig),
  ],
  providers: [
    ...SERVICES,
    ...PROVIDERS,
    File,
    EmailComposer,
  ],
})
export class CoreModule {}