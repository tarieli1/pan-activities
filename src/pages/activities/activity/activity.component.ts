import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import {
  UserActivitiesProvider,
  ActivitiesProvider,
  PendingUserActivitiesProvider,
  UtilsService,
  ToasterService,
  PushService,
} from '../../../core';
import { AuthGuard } from '../../../shared';
import { User, Activity, UserActivity, ActivitiesExpiration } from '../../../models';

@Component({
  templateUrl: 'activity.component.html',
})
export class ActivityComponent implements OnDestroy {

  registeredUsersSub: any;
  pendingUsersSub: any;
  user: User;
  activity: Activity;
  expiration: ActivitiesExpiration;
  registeredUsers: UserActivity[] = [];
  pendingUsers: UserActivity[] = [];
  isRegistered: boolean = false;
  isPending: boolean = false;
  isAdmin: boolean = false;
  now = this.utilsService.nowDate;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userActivitiesProvider: UserActivitiesProvider,
    public activitiesProvider: ActivitiesProvider,
    public pendingUserActivitiesProvider: PendingUserActivitiesProvider,
    public auth: AuthGuard,
    public toast: ToasterService,
    public utilsService: UtilsService,
    private alertCtrl: AlertController,
    private pushService: PushService,
  ) {
    this.activity = this.params.get('activity');
    this.user = this.params.get('user');
    this.expiration = this.params.get('expiration');
    this.isAdmin = this.user.role === 'admin';
    this.getUsersByActivity();
    this.getPendingUsersByActivity();
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin', 'user']);
  }

  getUsersByActivity() {
    const loading = this.utilsService.createLoader();
    loading.present();
    this.registeredUsersSub = this.userActivitiesProvider.getUsersByActivity()
      .subscribe((usersActivities) => {
        this.registeredUsers = usersActivities.filter(x => x.activity_key === this.activity.$key);
        const user = this.registeredUsers.find(x => x.user_name === this.user.name);
        this.isRegistered = typeof user !== 'undefined';
        loading.dismiss();
      });
  }

  getPendingUsersByActivity() {
    const loading = this.utilsService.createLoader();
    loading.present();
    this.pendingUsersSub = this.pendingUserActivitiesProvider.getPendingUserActivities()
      .subscribe((pendingUsers) => {
        this.pendingUsers = pendingUsers.filter(x => x.activity_key === this.activity.$key);
        const user = this.pendingUsers.find(x => x.user_name === this.user.name);
        this.isPending = typeof user !== 'undefined';
        loading.dismiss();
      });
  }

  isExpired() {
    if (this.expiration.expired < this.now) {
      this.toast.presentToast(`
        Expiration date for activities actions were until
        the ${this.expiration.expired}, actions for this month
        are not allowed any more.`, false, 5000
      );
      return true;
    }
    return false;
  }

  onRegister() {
    if (this.isExpired()) return;
    if (this.activity.comment_needed) {
      const alert = this.alertCtrl.create({
        title: 'Register',
        inputs: [
          {
            name: 'comments',
            placeholder: 'Comments',
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Register',
            handler: data => {
              this.register(data.comments);
            }
          }
        ]
      });
      alert.present();
    } else {
      this.register('');
    }
  }

  register(comments: string) {
    if (this.registeredUsers.length < this.activity.max_users) {
      this.userActivitiesProvider.register(this.activity, this.user, comments);
      this.toast.presentToast(`Successfully registered ${this.activity.name}`);
    } else {
      this.pendingUserActivitiesProvider.register(this.activity, this.user, comments);
      this.toast.presentToast(
        `${this.activity.name} activity is currently full,
         you were added to pending list and waiting for
          response from your admin`, false, 5000
      );
      this.pushService.notifyAdmins(this.user, this.activity);
    }
    this.navCtrl.pop();
  }

  cancelRegistration() {
    if (this.isExpired()) return;
    const userActivity = this.registeredUsers.find(x => x.user_name === this.user.name);
    this.userActivitiesProvider.removeUserActivity(userActivity.$key);
    this.toast.presentToast(`Successfully unregistered to ${this.activity.name}`);
    this.navCtrl.pop();
  }

  cancelPending() {
    if (this.isExpired()) return;
    const pendingUser = this.pendingUsers.find(x => x.user_name === this.user.name);
    this.pendingUserActivitiesProvider.removePendingUser(pendingUser.$key);
    this.toast.presentToast(`Successfully removed from waiting list of ${this.activity.name}`);
    this.navCtrl.pop();
  }

  removeActivity() {
    const alert = this.alertCtrl.create({
      title: 'Are you sure',
      message: 'you want to delete this activity?',
      buttons: [
        { text: 'I regret', role: 'cancel' },
        {
          text: 'I am sure',
          handler: () => {
            this.activitiesProvider.removeActivity(this.activity.$key);
            this.userActivitiesProvider.removeUsersFromActivity(this.activity.$key);
            this.pendingUserActivitiesProvider.removeUsersFromActivity(this.activity.$key);
            this.toast.presentToast(`Successfully deleted ${this.activity.name}`);
            this.navCtrl.pop();
          },
        }
      ]
    });
    alert.present();
  }

  canRegister() {
    return !this.isRegistered && !this.isPending && this.activity.max_users > this.registeredUsers.length;
  }

  canPending() {
    return !this.isRegistered && !this.isPending && this.activity.max_users <= this.registeredUsers.length;
  }

  ngOnDestroy() {
    if (this.registeredUsersSub) {
      this.registeredUsersSub.unsubscribe();
    }
    if (this.pendingUsersSub) {
      this.pendingUsersSub.unsubscribe();
    }
  }
}
