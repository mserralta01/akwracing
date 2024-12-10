export type Timezone =
  | "America/New_York"
  | "America/Chicago"
  | "America/Denver"
  | "America/Los_Angeles"
  | "America/Anchorage"
  | "America/Adak"
  | "America/Phoenix"
  | "America/Boise"
  | "America/Indiana/Indianapolis"
  | "America/Indiana/Knox"
  | "America/Indiana/Marengo"
  | "America/Indiana/Petersburg"
  | "America/Indiana/Tell_City"
  | "America/Indiana/Vevay"
  | "America/Indiana/Vincennes"
  | "America/Indiana/Winamac"
  | "America/Kentucky/Louisville"
  | "America/Kentucky/Monticello"
  | "America/Detroit"
  | "America/Menominee"
  | "America/North_Dakota/Beulah"
  | "America/North_Dakota/Center"
  | "America/North_Dakota/New_Salem"
  | "Pacific/Honolulu";

export type UserSettings = {
  timezone: Timezone;
};

export type { Enrollment, StudentProfile } from './student'; 