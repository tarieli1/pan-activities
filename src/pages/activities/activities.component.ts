import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
  ActivitiesProvider,
  UserActivitiesProvider,
  CsvService,
  EmailService,
  UtilsService,
  UserProvider,
  ActivitiesExpirationProvider,
} from '../../core';
import { ActivityComponent } from './activity';
import { AuthGuard } from '../../shared';
import { Activity, User, ActivitiesExpiration } from '../../models';

@Component({
  templateUrl: 'activities.component.html'
})
export class ActivitiesComponent implements OnInit, OnDestroy {

  activities: Activity[];
  user: User;
  isAdmin: boolean = false;
  sub: any;
  usersActivitiesSub: any;
  activitiesSub: any;
  userSub: any;
  expirationSub: any;
  expirationsSub: any;
  loading: any;
  month: string;
  expiration: ActivitiesExpiration;
  date: any = this.utilsService.date;

  constructor(
    public navCtrl: NavController,
    public activitiesProvider: ActivitiesProvider,
    public auth: AuthGuard,
    public csvService: CsvService,
    public emailService: EmailService,
    public userActivitiesProvider: UserActivitiesProvider,
    public utilsService: UtilsService,
    public userProvider: UserProvider,
    public activitiesExpirationProvider: ActivitiesExpirationProvider,
  ) {}

  ngOnInit() {
    this.sub = this.activitiesProvider.getActivities()
      .subscribe((activities) => {
        this.activities = activities.length ? activities : null;
      });
    this.expirationSub = this.activitiesExpirationProvider.getExpiration()
      .subscribe((expiration) => {
        this.expiration = expiration.length ? expiration[0] : {};
      });
    this.userSub = this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.isAdmin = user.role === 'admin';
      this.user = user;
      this.userProvider.updateDeviceToken(user);
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
    this.expirationsSub = this.activitiesExpirationProvider.getExpirationByDate(this.date)
      .subscribe((expiration) => {
        this.expiration = expiration.length ? expiration[0] : {};
      });
    this.activitiesSub = this.activitiesProvider.getActivitiesByDate(this.date)
      .subscribe((activities) => {
        this.activities = activities.length ? activities : null;
        this.month = this.utilsService.getMonthName(+this.date.slice(5, 7));
        this.loading.dismiss();
      });
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
    this.navCtrl.push(ActivityComponent, { activity, user: this.user, expiration: this.expiration });
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
    if (this.expirationSub) {
      this.expirationSub.unsubscribe();
    }
    if (this.expirationsSub) {
      this.expirationsSub.unsubscribe();
    }
    if (this.activitiesSub) {
      this.activitiesSub.unsubscribe();
    }
  }
}
