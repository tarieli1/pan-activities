import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider, UtilsService, ToasterService } from '../../core';
import { ActivitiesComponent } from '../../pages';

@Component({
  templateUrl: 'login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  id: number;
  loading: any;
  sub: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userProvider: UserProvider,
    public storage: Storage,
    public utilsService: UtilsService,
    public toast: ToasterService,
  ) {
  }

  ngOnInit() {
    const expired = this.params.get('expired');
    if (expired) {
      this.toast.presentToast('Please re-login cause employee auth expired', false);
    }
  }

  login() {
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    this.sub = this.userProvider.getUser(this.id).subscribe((user => {
      this.loading.dismiss();
      if (user.$exists()) {
        this.storage.set('user', user);
        this.navCtrl.setRoot(ActivitiesComponent);
      } else {
        this.toast.presentToast('Employee id does not exist in our system, please try again', false, 5000);
      }
    }));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}