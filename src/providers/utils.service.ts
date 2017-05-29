import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  month: any;
  now: Date;

  get date() {
    this.now = new Date();
    this.month = this.now.getMonth() + 1;
    if (this.month < 10) {
      this.month = `0${this.month}`;
    }
    return `${this.now.getFullYear()}-${this.month}`;
  }

}
