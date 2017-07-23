import { Component, OnDestroy } from '@angular/core';
import { NavController } from 'ionic-angular';

import { UserActivitiesProvider, ActivitiesProvider, UtilsService, UserProvider } from '../../core';
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
  activitiesSub: any;
  userSub: any;
  user: User;
  userActivities: UserActivity[];
  month: string;
  date = this.utilsService.date;

  constructor(
    public navCtrl: NavController,
    public auth: AuthGuard,
    public userProvider: UserProvider,
    public userActivitiesProvider: UserActivitiesProvider,
    public activitiesProvider: ActivitiesProvider,
    public utilsService: UtilsService,
  ) {
    this.userSub = this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.user = user;
      this.getUserActivities();
    });
    this.month = this.utilsService.getMonthName();
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin', 'user']);
  }

  changeMonth(event) {
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    // move forward
    if (event.direction === 2) {
      this.date = this.utilsService.changeMonth(this.date, 'add');
    } else if (event.direction === 4) { // move backwards
      this.date = this.utilsService.changeMonth(this.date, 'sub');
    }
    this.activitiesSub = this.userActivitiesProvider.getUserActivitiesByDate(this.date)
      .subscribe((usersActivities) => {
        const userActivities = usersActivities.filter(x => x.user_name === this.user.name);
        this.userActivities = userActivities.length ? userActivities : null;
        this.month = this.utilsService.getMonthName(+this.date.slice(5, 7));
        this.loading.dismiss();
      });
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
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.activitiesSub) {
      this.activitiesSub.unsubscribe();
    }
  }

}