import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class UtilsService {

  month: any;
  now: Date;

  constructor(public loadingCtrl: LoadingController) {}

  get date() {
    this.now = new Date();
    this.month = this.now.getMonth() + 1;
    if (this.month < 10) {
      this.month = `0${this.month}`;
    }
    return `${this.now.getFullYear()}-${this.month}`;
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
