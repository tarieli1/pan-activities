import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Calendar } from '@ionic-native/calendar';

import { UtilsService } from './utils.service';
import { UserActivitiesProvider, UserProvider, ActivitiesProvider } from '../providers';
import { User, UserActivity, Activity } from '../../models';

@Injectable()
export class CalendarService implements OnInit, OnDestroy {

  date: any = this.utilsService.date;
  user: User;
  userActivities: UserActivity[];
  userActivitiesSub: any;
  userSub: any;
  activitiesSub: any;

  constructor(
    public calendar: Calendar,
    public utilsService: UtilsService,
    public userActivitiesProvider: UserActivitiesProvider,
    public userProvider: UserProvider,
    public activitiesProvider: ActivitiesProvider,
    ) {}

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userSub = this.userProvider.user$.subscribe((user) => {
      if (!user) return;
      this.user = user;
    })
  }

  addActivities() {
    if (!this.user) {
      this.getUser();
    }
    this.userActivitiesSub = this.userActivitiesProvider.getUserActivitiesByDate(this.date)
      .subscribe((usersActivities) => {
        const userActivities = usersActivities.filter(x => x.user_name === this.user.name);
        this.userActivities = userActivities.length ? userActivities : [];
        this.userActivities.forEach((userActivity) => {
          this.activitiesSub = this.activitiesProvider.getActivity(userActivity.activity_key)
            .subscribe(activity => this.addToCalendar(activity, userActivity.comments));
        });
      });
  }

  addToCalendar(activity: Activity, comments: string) {
    if (Array.isArray(activity.days)) {
      activity.days.forEach((day) => {
        const date = new Date(day);
        this.calendar.createEvent(activity.name, activity.location, comments, date, date);
      });
    } else {
      this.calendar.createEvent(activity.name, activity.location, comments, activity.days, activity.days);
    }
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.userActivitiesSub) {
      this.userActivitiesSub.unsubscribe();
    }
    if (this.activitiesSub) {
      this.activitiesSub.unsubscribe();
    }
  }
}
