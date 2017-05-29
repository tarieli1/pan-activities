import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { ActivitiesProvider } from '../../providers';
import { ToasterService } from '../../shared';

@Component({
  templateUrl: 'add-activity.component.html'
})
export class AddActivityComponent {

  loading: any;
  activity = {};

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toast: ToasterService,
    public activitiesProvider: ActivitiesProvider,
  ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
  }

  save() {
    this.loading.present();
    this.activitiesProvider.addActivity(this.activity);
    this.loading.dismiss();
    this.navCtrl.pop();
    this.toast.presentToast('Successfully added new activity');
  }
}