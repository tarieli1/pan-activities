import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PushService, UtilsService, ActivitiesExpirationProvider } from '../../core';
import { AuthGuard } from '../../shared';

@Component({
  templateUrl: 'publish-activities.component.html'
})
export class PublishActivitiesComponent implements OnInit, OnDestroy {

  expiredSub: any;
  changeSub: any;
  expiredDate = `${this.utilsService.date}-20`;
  date = this.utilsService.date;
  isPublished: boolean = false;

  constructor(
    public navCtrl: NavController,
    public auth: AuthGuard,
    public pushService: PushService,
    public utilsService: UtilsService,
    public activitiesExpirationProvider: ActivitiesExpirationProvider,
  ) {}

  ngOnInit() {
    this.expiredSub = this.activitiesExpirationProvider.getExpiration()
      .subscribe((expiration) => {
        this.isPublished = !!expiration.length;
      });
  }

  onChange() {
    this.changeSub = this.activitiesExpirationProvider.getExpirationByDate(this.date)
      .subscribe((expiration) => {
        this.isPublished = !!expiration.length;
      });
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin']);
  }

  publish() {
    this.activitiesExpirationProvider.addExpiration({ date: this.date, expired: this.expiredDate });
    this.pushService.notifyUsers(this.expiredDate);
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    if (this.expiredSub) {
      this.expiredSub.unsubscribe();
    }
    if (this.changeSub) {
      this.changeSub.unsubscribe();
    }
  }
}
