import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserProvider } from '../../providers';
import { ToasterService } from '../../shared';
import { ActivitiesComponent } from '../../pages';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  id: number;
  userExist: boolean;
  loading: any;
  sub: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userProvider: UserProvider,
    public storage: Storage,
    public loadingCtrl: LoadingController,
    public toast: ToasterService,
  ) {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
    });
  }

  ngOnInit() {
    const expired = this.params.get('expired');
    if (expired) {
      this.toast.presentToast('Please re-login cause employee auth expired', false);
    }
  }

  login() {
    this.loading.present();
    this.sub = this.userProvider.getUser(this.id).subscribe((user => {
      this.loading.dismiss();
      if (user.$exists()) {
        this.storage.set('user', user);
        this.userExist = true;
        this.navCtrl.setRoot(ActivitiesComponent);
      } else {
        this.userExist = false
      }
    }));
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}