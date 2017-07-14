import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {
  ActivitiesProvider,
  UserActivitiesProvider,
  CsvService,
  EmailService,
  UtilsService,
} from '../../core';
import { ActivityComponent } from './activity';
import { Activity, User } from '../../models';
import { AuthGuard } from '../../shared';

@Component({
  templateUrl: 'activities.component.html'
})
export class ActivitiesComponent implements OnInit, OnDestroy {

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
    public utilsService: UtilsService,
  ) {}

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
    this.auth.canActivate(this.navCtrl, ['admin', 'user']);
  }

  exportToCsv() {
    this.loading = this.utilsService.createLoader();
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

  getImg(name: string) {
    return this.utilsService.getActivityImage(name);
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
