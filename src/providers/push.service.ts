import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Injectable()
export class PushService {

  constructor(private push: Push) {}

  checkPermissions() {
    this.push.hasPermission()
      .then((res: any) => {
        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });
  }

  initPush() {
    const options: PushOptions = {
      android: {
        senderID: '425195188130'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'true',
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }

}
