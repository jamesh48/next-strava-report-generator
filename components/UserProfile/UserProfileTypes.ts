export interface YTDRunTotals {
  distance: number;
  count: number;
  elapsed_time: number;
}

export interface YTDSwimTotals {
  distance: number;
  count: number;
  elapsed_time: number;
}

export interface ProfileData {
  id: number;
  profile: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  ytd_run_totals: YTDRunTotals;
  ytd_swim_totals: YTDSwimTotals;
}
