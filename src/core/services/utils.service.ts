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

  get nowDate() {
    const date = this.date;
    let day: any = this.now.getDate();
    if (day < 10) {
      day = `0${day}`;
    }
    return `${date}-${day}`;
  }

  getMonthName(month = null) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return monthNames[month ? month - 1 : this.now.getMonth() + 1];
  }

  changeMonth(date: string, op: string) {
    let month: any = +date.slice(5, 7);
    let year: any = +date.slice(0, 4);
    if (month === 12 && op === 'add') {
      month = 1;
      year += 1;
    } else if (month === 1 && op === 'sub') {
      month = 12;
      year -= 1;
    } else {
      month = op === 'add' ? month += 1 : month -= 1;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    return `${year}-${month}`;
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
