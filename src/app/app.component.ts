import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MenuController, Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import {
  ActivitiesComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
} from '../pages';
import { UserProvider } from '../core';
import { config } from '../config';

@Component({
  templateUrl: 'app.component.html',
})
export class PanActivitiesComponent implements OnDestroy {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginComponent;
  pages: Array<{ title: string, component: any, role: string }>;
  isAdmin = false;
  notificationSub: any;
  errorSub: any;
  registerSub: any;


  constructor(
      public platform: Platform,
      public menu: MenuController,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public push: Push,
      public alertCtrl: AlertController,
      public userProvider: UserProvider,
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Activities', component: ActivitiesComponent, role: 'all' },
      { title: 'My Activities', component: MyActivitiesComponent, role: 'all' },
      { title: 'Add Activity', component: AddActivityComponent, role: 'admin' },
    ];
    this.initUser();
  }

  initUser() {
    this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.rootPage = ActivitiesComponent;
      this.isAdmin = user.role === 'admin';
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.pushSetup();
    });
  }

  pushSetup() {
    const options: PushOptions = {
      android: {
        senderID: config.firebaseConfig.messagingSenderId,
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    this.notificationSub = pushObject.on('notification').subscribe((notification: any) => {
      if (notification.additionalData.foreground) {
        let youralert = this.alertCtrl.create({
          title: 'New Push notification',
          message: notification.message
        });
        youralert.present();
      }
    });

    this.registerSub = pushObject.on('registration').subscribe((registration: any) => {
      console.log('registration', registration);
    });

    this.errorSub = pushObject.on('error').subscribe(error => alert('Error with Push plugin' + error));
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
  }

  logout() {
    this.menu.close();
    this.userProvider.logout().then(() => this.nav.setRoot(LoginComponent));
  }

  ngOnDestroy() {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
    if (this.registerSub) {
      this.registerSub.unsubscribe();
    }
    if (this.errorSub) {
      this.errorSub.unsubscribe();
    }
  }
}