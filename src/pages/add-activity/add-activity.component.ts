import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActivitiesProvider, UtilsService, ToasterService } from '../../core';
import { AuthGuard } from '../../shared';

@Component({
  templateUrl: 'add-activity.component.html'
})
export class AddActivityComponent {

  loading: any;
  activity: object = {
    name: '',
    date: this.utilsService.date,
    img: '',
    week_type: 'Weekly',
    days: '',
    start_time: '',
    end_time: '',
    max_users: 14,
    min_users: 1,
    comments: '',
    comment_needed: false,
  };

  constructor(
    public navCtrl: NavController,
    public utilsService: UtilsService,
    public toast: ToasterService,
    public activitiesProvider: ActivitiesProvider,
    public auth: AuthGuard,
  ) {
  }

  ionViewCanEnter() {
    this.auth.canActivate(this.navCtrl, ['admin']);
  }

  save() {
    debugger;
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    this.activitiesProvider.addActivity(this.activity);
    this.loading.dismiss();
    this.navCtrl.pop();
    this.toast.presentToast('Successfully added new activity');
  }
}