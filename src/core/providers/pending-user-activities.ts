import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import { UtilsService } from '../services';
import { User, Activity } from '../../models';

@Injectable()
export class PendingUserActivitiesProvider {

  date: string;

  constructor(public afd: AngularFireDatabase, public utils: UtilsService, public storage: Storage) {
    this.date = utils.date;
  }

  register(activity: Activity, user: User, comments: string) {
    this.storage.get('userKey').then((key) => {
      const obj = {
        comments,
        date: this.date,
        activity_key: activity.$key,
        activity_name: activity.name,
        user_key: key,
        user_name: user.name,
      };
      this.afd.list('/pending_user_activities').push(obj);
    });
  }

  getPendingUserActivities() {
    return this.afd.list('/pending_user_activities', {
      query: {
        orderByChild: 'date',
        equalTo: this.date,
      }
    });
  }

  removePendingUser(id: string) {
    this.afd.list('/pending_user_activities').remove(id);
  }
}
