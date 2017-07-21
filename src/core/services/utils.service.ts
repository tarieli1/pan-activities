import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class UtilsService {

  constructor(public loadingCtrl: LoadingController) {}

  now: Date = new Date();

  get date() {
    let month: any = this.now.getMonth() + 2;
    if (month < 10) {
      month = `0${month}`;
    }
    return `${this.now.getFullYear()}-${month}`;
  }

  get monthName() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[this.now.getMonth() + 1];
  }

  createLoader() {
    return this.loadingCtrl.create({ spinner: 'crescent' });
  }

  getActivityImage(activityName: string) {
    let path = '';
    switch (activityName.toLowerCase()) {
      case 'soccer':
        path = 'assets/img/soccer.jpg';
        break;
      case 'pilates':
        path = 'assets/img/pilates.jpg';
        break;
      case 'hiit':
        path = 'assets/img/hiit.jpg';
        break;
      case 'ping pong':
        path = 'assets/img/ping-pong.jpg';
        break;
      case 'running/fitness group':
        path = 'assets/img/running.jpg';
        break;
      case 'board games':
        path = 'assets/img/board-games.jpg';
        break;
      default:
        path = 'assets/img/pan.jpg';
        break;
    }

    return path;
  }
}
