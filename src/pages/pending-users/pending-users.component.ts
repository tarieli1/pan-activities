import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PendingUserActivitiesProvider, UserActivitiesProvider, PushService } from '../../core';
import { AuthGuard } from '../../shared';
import { UserActivity } from '../../models';

@Component({
  templateUrl: 'pending-users.component.html'
})
export class PendingUsersComponent implements OnInit, OnDestroy {

  pendingUsersSub: any;
  pendingUsers: UserActivity[];

  constructor(
    public navCtrl: NavController,
    public auth: AuthGuard,
    public pendingUsersProvider: PendingUserActivitiesProvider,
    public userActivitiesProvider: UserActivitiesProvider,
    public pushService: PushService,
  ) {}

  ngOnInit() {
    this.pendingUsersSub = this.pendingUsersProvider.getPendingUserActivities()
      .subscribe((pendingUsers) => {
        this.pendingUsers = pendingUsers.length ? pendingUsers : null;
      });
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin']);
  }

  addUserToActivity(pendingUser: UserActivity) {
    this.pushService.notifyUser(pendingUser.user_key, `Registration for ${pendingUser.activity_name}`, 'You were successfully added to activity');
    this.userActivitiesProvider.register({ $key: pendingUser.activity_key, name: pendingUser.activity_name }, { $key: pendingUser.user_key, name: pendingUser.user_name });
    this.pendingUsersProvider.removePendingUser(pendingUser.$key);
  }

  removeUserFromActivity(pendingUser: UserActivity) {
    this.pushService.notifyUser(pendingUser.user_key, `Registration for ${pendingUser.activity_name}`, 'Sorry but there was no room this month for this activity, maybe next month');
    this.pendingUsersProvider.removePendingUser(pendingUser.$key);
  }

  ngOnDestroy() {
    if (this.pendingUsersSub) {
      this.pendingUsersSub.unsubscribe();
    }
  }
}
