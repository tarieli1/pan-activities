import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { UserActivitiesProvider, ActivitiesProvider, PendingUserActivitiesProvider } from '../../../providers';
import { AuthGuard, ToasterService } from '../../../shared';
import { User, Activity, UserActivity } from '../../../models';

@Component({
  templateUrl: 'activity.component.html',
})
export class ActivityComponent {

  loading: any;
  registeredUsersSub: any;
  user: User;
  activity: Activity;
  registeredUsers: UserActivity[];
  isRegistered = false;
  isAdmin = false;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userActivitiesProvider: UserActivitiesProvider,
    public activitiesProvider: ActivitiesProvider,
    public pendingUserActivitiesProvider: PendingUserActivitiesProvider,
    public auth: AuthGuard,
    public toast: ToasterService,
    public loadingCtrl: LoadingController,
  ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
    this.activity = this.params.get('activity');
    this.user = this.params.get('user');
    this.isAdmin = this.user.role === 'admin';
    this.getUsersByActivity();
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl);
  }

  getUsersByActivity() {
    this.loading.present();
    this.registeredUsersSub = this.userActivitiesProvider.getUsersByActivity()
      .subscribe((usersActivities) => {
        this.registeredUsers = usersActivities.filter(x => x.activity_key === this.activity.$key);
        const user = this.registeredUsers.find(x => x.user_name === this.user.name);
        this.isRegistered = typeof user !== 'undefined';
        this.loading.dismiss();
      });
  }

  register() {
    if (this.registeredUsers.length < this.activity.max_users) {
      this.userActivitiesProvider.register(this.activity, this.user);
      this.toast.presentToast(`Successfully registered ${this.activity.name}`);
    } else {
      this.pendingUserActivitiesProvider.register(this.activity, this.user);
      this.toast.presentToast(
        `${this.activity.name} activity is currently full,
         you were added to pending list and waiting for
          response from your admin`, false, 5000
      );
    }
    this.navCtrl.pop();
  }

  removeActivity() {
    this.activitiesProvider.removeActivity(this.activity.$key);
    this.toast.presentToast(`Successfully deleted ${this.activity.name}`);
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    if (this.registeredUsersSub) {
      this.registeredUsersSub.unsubscribe();
    }
  }

}
