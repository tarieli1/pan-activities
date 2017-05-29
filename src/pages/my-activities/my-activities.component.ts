import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserActivitiesProvider } from '../../providers';
import { AuthGuard } from '../../shared';
import { User, UserActivity } from '../../models';

@Component({
  templateUrl: 'my-activities.component.html'
})
export class MyActivitiesComponent {

  loading: any;
  userActivitiesSub: any;
  user: User;
  userActivities: UserActivity[];

  constructor(
    public navCtrl: NavController,
    public auth: AuthGuard,
    public storage: Storage,
    public userActivitiesProvider: UserActivitiesProvider,
    public loadingCtrl: LoadingController,
  ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
    this.storage.get('user').then((user) => {
      this.user = user;
      this.getUserActivities();
    });
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl);
  }

  getUserActivities() {
    this.loading.present();
    this.userActivitiesSub = this.userActivitiesProvider.getUserActivities()
      .subscribe((usersActivities) => {
        this.userActivities = usersActivities.filter(x => x.user_name === this.user.name);
        this.loading.dismiss();
      });
  }

  ngOnDestroy() {
    if (this.userActivitiesSub) {
      this.userActivitiesSub.unsubscribe();
    }
  }

}