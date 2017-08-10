import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';

import { UtilsService } from '../services';

@Injectable()
export class UserActivitiesProvider {

  date: string;

  constructor(public afd: AngularFireDatabase, public utils: UtilsService, public storage: Storage) {
    this.date = utils.date;
  }

  register(activity: any, user: any, comments: string = '') {
    this.storage.get('userKey').then((key) => {
      const obj = {
        comments,
        date: this.date,
        activity_key: activity.$key,
        activity_name: activity.name,
        user_key: key,
        user_name: user.name,
      };
      this.afd.list('/user_activities').push(obj);
    });
  }

  getUserActivities() {
    return this.getUsersActivities();
  }

  getUserActivitiesByDate(date) {
    return this.afd.list('/user_activities', {
      query: {
        orderByChild: 'date',
        equalTo: date,
      }
    });
  }

  removeUsersFromActivity(activityKey: string) {
    const userActivities = this.afd.list('/user_activities', {
      preserveSnapshot: true,
      query: {
        orderByChild: 'activity_key',
        equalTo: activityKey
      }
    });
    userActivities.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        snapshot.ref.remove();
      });
    })
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

  removeUserActivity(id: string) {
    this.afd.list('/user_activities').remove(id);
  }
}
