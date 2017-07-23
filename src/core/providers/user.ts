import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ToasterService } from '../services';
import { User } from '../../models';

@Injectable()
export class UserProvider implements OnDestroy {

  public user$ = new BehaviorSubject(null);
  userSub: any;

  constructor(
    public afd: AngularFireDatabase,
    public storage: Storage,
    public toast: ToasterService,
  ) {
    this.storage.get('user').then((user) => {
      if (!user) return;
      this.user$.next(user);
    });
  }

  userChanged(id: number) {
    this.userSub = this.getUser(id).subscribe((user) => {
      if (user.$exists()) {
        this.storage.set('userKey', user.$key);
        this.storage.set('user', user);
        this.user$.next(user);
      } else {
        this.toast.presentToast('Employee id does not exist in our system, please try again', false, 5000);
      }
    });
  }

  getUser(id: number) {
    return this.afd.object(`/users/${id}`);
  }

  logout() {
    this.user$.next(null);
    this.storage.remove('userKey');
    this.storage.remove('deviceToken');
    return this.storage.remove('user');
  }

  updateDeviceToken(user: User) {
    this.storage.get('deviceToken').then((deviceToken) => {
      this.storage.get('userKey').then((key) => {
        const userModel = this.getUser(key);
        const newUser = Object.assign({ deviceToken }, user);
        userModel.update(newUser);
      });
    });
  }

  getAdmins() {
    return this.afd.list('/users', {
      query: {
        orderByChild: 'role',
        equalTo: 'admin',
      }
    });
  }

  getUsers() {
    return this.afd.list('/users', {
      query: {
        orderByChild: 'role',
        equalTo: 'user',
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
