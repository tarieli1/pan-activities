import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserActivitiesProvider, ActivitiesProvider, UtilsService } from '../../core';
import { AuthGuard } from '../../shared';
import { User, UserActivity } from '../../models';
import { ActivityComponent } from '../activities';

@Component({
  templateUrl: 'my-activities.component.html'
})
export class MyActivitiesComponent implements OnDestroy {

  loading: any;
  userActivitiesSub: any;
  activitySub: any;
  user: User;
  userActivities: UserActivity[];

  constructor(
    public navCtrl: NavController,
    public auth: AuthGuard,
    public storage: Storage,
    public userActivitiesProvider: UserActivitiesProvider,
    public activitiesProvider: ActivitiesProvider,
    public utilsService: UtilsService,
  ) {
    this.storage.get('user').then((user) => {
      this.user = user;
      this.getUserActivities();
    });
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin', 'user']);
  }

  getUserActivities() {
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    this.userActivitiesSub = this.userActivitiesProvider.getUserActivities()
      .subscribe((usersActivities) => {
        const userActivities = usersActivities.filter(x => x.user_name === this.user.name);
        this.userActivities = userActivities.length ? userActivities : null;
        this.loading.dismiss();
      });
  }

  enterActivity(activityKey: string) {
    this.activitySub = this.activitiesProvider.getActivity(activityKey)
      .subscribe((activity) => {
        this.navCtrl.push(ActivityComponent, { activity, user: this.user });
      });
  }

  ngOnDestroy() {
    if (this.userActivitiesSub) {
      this.userActivitiesSub.unsubscribe();
    }
    if (this.activitySub) {
      this.activitySub.unsubscribe();
    }
  }

}