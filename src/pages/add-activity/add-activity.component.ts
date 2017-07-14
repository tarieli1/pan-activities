import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ActivitiesProvider, UtilsService } from '../../providers';
import { ToasterService, AuthGuard } from '../../shared';

@Component({
  templateUrl: 'add-activity.component.html'
})
export class AddActivityComponent {

  loading: any;
  activity: object = {};

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
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    this.activitiesProvider.addActivity(this.activity);
    this.loading.dismiss();
    this.navCtrl.pop();
    this.toast.presentToast('Successfully added new activity');
  }
}