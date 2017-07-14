import { Component, ViewChild } from '@angular/core';
import { MenuController, Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import {
  ActivitiesComponent,
  MyActivitiesComponent,
  LoginComponent,
  AddActivityComponent,
} from '../pages';
import { User } from "../models";

@Component({
  templateUrl: 'app.component.html',
})
export class PanActivitiesComponent {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginComponent;
  pages: Array<{ title: string, component: any }>;
  user: User;
  isAdmin = false;

  constructor(
      public platform: Platform,
      public menu: MenuController,
      public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public storage: Storage,
  ) {
    this.storage.get('user').then((user) => {
      if (user) {
        this.rootPage = ActivitiesComponent;
        this.user = user;
        this.isAdmin = this.user.role === 'admin';
      }
    });
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Activities', component: ActivitiesComponent },
      { title: 'My Activities', component: MyActivitiesComponent },
      { title: 'Add Activity', component: AddActivityComponent },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.push(page.component);
  }

  logout() {
    this.menu.close();
    this.storage.remove('user').then(() => {
      this.nav.setRoot(LoginComponent);
    });
  }
}
