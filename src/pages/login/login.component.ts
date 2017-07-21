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
  userSub: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public userProvider: UserProvider,
    public storage: Storage,
    public utilsService: UtilsService,
    public toast: ToasterService,
  ) {}

  ngOnInit() {
    const expired = this.params.get('expired');
    if (expired) {
      this.toast.presentToast('Please re-login cause employee authentication expired', false);
    }
  }

  login() {
    this.loading = this.utilsService.createLoader();
    this.loading.present();
    this.userProvider.userChanged(this.id);
    this.loading.dismiss();
    this.userSub = this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.navCtrl.setRoot(ActivitiesComponent);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}