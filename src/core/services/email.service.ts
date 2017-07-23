import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';

import { UtilsService } from './utils.service';

@Injectable()
export class EmailService {

  date: string;

  constructor(public email: EmailComposer, public utils: UtilsService) {
    this.date = utils.date;
  }

  send(fileEntry: any) {
    let email = {
      to: 'rbenmeir@paloaltonetworks.com',
      cc: 'ueldad@paloaltonetworks.com',
      attachments: [
        fileEntry.nativeURL,
      ],
      subject: `Pan Activities (${this.date})`,
      body: 'Hi all, here are your activities :)',
      isHtml: true
    };
    this.email.open(email);
  }
}
