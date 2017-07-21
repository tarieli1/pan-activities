export interface Activity {
  $key: string;
  img: string;
  name: string;
  start_time: string;
  end_time: string;
  days: string;
  week_type: string;
  comments: string;
  max_users: number;
  min_users: number;
  date: string;
  comment_needed: boolean;
}