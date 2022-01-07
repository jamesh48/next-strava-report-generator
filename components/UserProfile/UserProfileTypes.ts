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

export interface SwimmingTotalsSection {
  profile: {
    ytd_swim_totals: YTDSwimTotals;
  };
}

export interface RunningTotalsSection {
  profile: {
    ytd_run_totals: YTDRunTotals;
  };
}

export interface ProfileData {
  profile: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  ytd_run_totals: YTDRunTotals;
  ytd_swim_totals: YTDSwimTotals;
}
