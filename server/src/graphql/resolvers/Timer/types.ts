export interface TimerArgs {
  id: string;
}

export interface CreateTimerArgs {
  start: number;
  title: string;
}

export interface StartTimerArgs {
  start: number;
  id: string;
}

export interface EndTimerArgs {
  end: number;
  id: string;
}

export interface UpdateTimerArgs {
  id: string;
  title: string;
  project_id: string;
  project_description: string;
  notes: string;
  type: string;
}

export interface DeleteTimerArgs {
  id: string;
}
