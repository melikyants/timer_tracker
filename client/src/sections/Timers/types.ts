export interface ITimer {
  id: string,
  title: string,
  project_id: string,
  category: string,
  description: string,
  notes: string,
  start: number,
  end: number
  isRunning: boolean
}

export type TimersData = {
  timers: ITimer[];
};

export interface IStartTimer {
  startTimer: ITimer
}

export interface IStartTimerVariables {
  start: number,
  title: string
}
// export interface DeleteListingData {
//   deleteListing: Listing;
// }

// export interface DeleteListingVariables {
//   id: string;
// }
