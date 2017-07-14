import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { UtilsService } from '../utils.service';

@Injectable()
export class ActivitiesProvider {

  date: string;

  constructor(public afd: AngularFireDatabase, public utils: UtilsService) {
    this.date = utils.date;
  }

  getActivities() {
    return this.afd.list('/activities', {
      query: {
        orderByChild: 'date',
        equalTo: this.date,
      }
    });
  }

  getActivity(activityKey: string) {
    return this.afd.object(`/activities/${activityKey}`);
  }

  addActivity(activity: any) {
    this.afd.list('/activities').push(activity);
  }

  removeActivity(id: string) {
    this.afd.list('/activities').remove(id);
  }
}
