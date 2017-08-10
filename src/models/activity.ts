export interface Activity {
  $key: string;
  name: string;
  start_time: string;
  end_time: string;
  days: any;
  location: string;
  comments: string;
  max_users: number;
  min_users: number;
  date: string;
  comment_needed: boolean;
}