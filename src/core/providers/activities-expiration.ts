import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { UtilsService } from '../services';

@Injectable()
export class ActivitiesExpirationProvider {

  date: string;

  constructor(public afd: AngularFireDatabase, public utils: UtilsService) {
    this.date = utils.date;
  }

  getExpiration() {
    return this.afd.list('/activities_expiration', {
      query: {
        orderByChild: 'date',
        equalTo: this.date,
      }
    });
  }

  getExpirationByDate(date) {
    return this.afd.list('/activities_expiration', {
      query: {
        orderByChild: 'date',
        equalTo: date,
      }
    });
  }

  addExpiration(activityExpiration: any) {
    this.afd.list('/activities_expiration').push(activityExpiration);
  }

  removeExpiration(key: string) {
    this.afd.list('/activities_expiration').remove(key);
  }
}
