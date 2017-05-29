import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

import { LoginComponent } from "../../pages";

@Injectable()
export class AuthGuard {

  constructor(public storage: Storage) {}

  canActivate(navCtrl) {
    this.storage.get('user').then((user) => {
      if (!user) {
        navCtrl.setRoot(LoginComponent, { expired: true });
      }
    });
  }
}
