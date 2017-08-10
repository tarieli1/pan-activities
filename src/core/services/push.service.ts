import { Injectable, OnDestroy } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { UserProvider, UserActivitiesProvider } from '../providers';
import { UtilsService } from '../services';
import { config } from '../../config';
import { User, Activity } from '../../models/';

@Injectable()
export class PushService implements OnDestroy {

  headers: any;
  adminsSub: any;
  usersSub: any;
  userSub: any;
  pushSub: any;
  userActivitiesSub: any;
  date: any = this.utilsService.date;

  constructor(
    public http: Http,
    public userProvider: UserProvider,
    public userActivitiesProvider: UserActivitiesProvider,
    public utilsService: UtilsService,
    ) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Authorization', `key=${config.fcm.serverKey}`);
  }

  notifyAdmins(user: User, activity: Activity) {
    this.adminsSub = this.userProvider.getAdmins().subscribe((admins) => {
      const body = {
        registration_ids: admins.map(admin => admin.deviceToken),
        notification: {
          title: 'Pending User',
          body: `Hi, ${user.name} was trying to register to ${activity.name} and the activity is full`,
        },
      };
      this.sendPush(body, this.headers);
    });
  }

  notifyUser(userKey: number, title: string, body: string) {
    this.userSub = this.userProvider.getUser(userKey).subscribe((user) => {
      const data = {
        to: user.deviceToken,
        notification: {
          title,
          body,
        },
      };
      this.sendPush(data, this.headers);
    });
  }

  notifyUsers(date) {
    this.usersSub = this.userProvider.getUsers().subscribe((users) => {
      const body = {
        registration_ids: users.map(user => user.deviceToken),
        notification: {
          title: 'Activities Published',
          body: `Hi all, you can now register to next month activities, registration will be until ${date}`,
        },
      };
      this.sendPush(body, this.headers);
    });
  }

  notifyUsersToAddActivities() {
    this.userActivitiesSub = this.userActivitiesProvider.getUserActivitiesByDate(this.date)
      .subscribe((userActivites) => {
        userActivites.forEach(user => this.notifyUser(user.user_key, 'Add To Calendar', 'Login to the app to add your activities to your calendar'));
    });
  }

  sendPush(body, headers) {
    this.pushSub = this.http.post(config.fcm.url, body, { headers })
      .subscribe(notification => console.log('notification', notification));
  }

  ngOnDestroy() {
    if (this.adminsSub) {
      this.adminsSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.pushSub) {
      this.pushSub.unsubscribe();
    }
    if (this.userActivitiesSub) {
      this.userActivitiesSub.unsubscribe();
    }
  }
}
