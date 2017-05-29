import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {
  ActivitiesProvider,
  UserActivitiesProvider,
  CsvService,
  EmailService,
} from '../../providers';
import { ActivityComponent } from './activity';
import { Activity, User } from '../../models';
import { AuthGuard } from '../../shared';

@Component({
  templateUrl: 'activities.component.html'
})
export class ActivitiesComponent implements OnInit {

  activities: Activity[];
  user: User;
  isAdmin: boolean = false;
  sub: any;
  usersActivitiesSub: any;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public activitiesProvider: ActivitiesProvider,
    public auth: AuthGuard,
    public csvService: CsvService,
    public emailService: EmailService,
    public userActivitiesProvider: UserActivitiesProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
  }

  ngOnInit() {
    this.sub = this.activitiesProvider.getActivities()
      .subscribe((activities) => {
        this.activities = activities;
      });
    this.storage.get('user').then((user) => {
      this.user = user;
      this.isAdmin = this.user.role === 'admin';
    });
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl);
  }

  exportToCsv() {
    this.loading.present();
    this.usersActivitiesSub = this.userActivitiesProvider.getUsersActivities()
      .subscribe((usersActivities) => {
        this.csvService.exportToCsv(usersActivities)
          .then((fileEntry) => {
            this.emailService.send(fileEntry);
            this.loading.dismiss();
          })
          .catch(err => this.loading.dismiss());
      });
  }

  enterActivity(activity) {
    this.navCtrl.push(ActivityComponent, { activity, user: this.user });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.usersActivitiesSub) {
      this.sub.usersActivitiesSub();
    }
  }

}
