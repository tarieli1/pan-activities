import { Injectable } from "@angular/core";
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToasterService {

  constructor(public toastCtrl: ToastController) {}

  presentToast(message, success = true, duration = 3000) {
    const toast = this.toastCtrl.create({
      duration,
      message,
      cssClass: success ? 'toaster-success' : 'toaster-error',
    });
    toast.present();
  }
}
