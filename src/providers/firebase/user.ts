import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UserProvider {

  constructor(public afd: AngularFireDatabase) {}

  getUser(id) {
    return this.afd.object(`/users/${id}`);
  }
}
