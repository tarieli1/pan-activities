import { NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { EmailComposer } from '@ionic-native/email-composer';

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
  providers: [
    ...SERVICES,
    ...PROVIDERS,
    File,
    EmailComposer,
  ],
})
export class CoreModule {}