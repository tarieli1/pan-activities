import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { UtilsService } from '../utils.service';
import { User, Activity } from '../../models';

@Injectable()
export class UserActivitiesProvider {

  date: string;

  constructor(public afd: AngularFireDatabase, public utils: UtilsService) {
    this.date = utils.date;
  }

  register(activity: Activity, user: User) {
    const obj = {
      date: this.date,
      activity_key: activity.$key,
      activity_name: activity.name,
      user_name: user.name,
    };
    this.afd.list('/user_activities').push(obj);
  }

  getUserActivities() {
    return this.getUsersActivities();
  }

  getUsersByActivity() {
    return this.getUsersActivities();
  }

  getUsersActivities() {
    return this.afd.list('/user_activities', {
      query: {
        orderByChild: 'date',
        equalTo: this.date,
      }
    });
  }
}
