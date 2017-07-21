import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  ActivitiesProvider,
  UserActivitiesProvider,
  CsvService,
  EmailService,
  UtilsService,
  UserProvider,
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
  userSub: any;
  loading: any;
  month: string;

  constructor(
    public navCtrl: NavController,
    public activitiesProvider: ActivitiesProvider,
    public auth: AuthGuard,
    public csvService: CsvService,
    public emailService: EmailService,
    public userActivitiesProvider: UserActivitiesProvider,
    public utilsService: UtilsService,
    public userProvider: UserProvider,
  ) {}

  ngOnInit() {
    this.sub = this.activitiesProvider.getActivities()
      .subscribe((activities) => {
        this.activities = activities;
      });
    this.userSub = this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.isAdmin = user.role === 'admin';
      this.user = user;
    });
    this.month = this.utilsService.monthName;
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
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

}
