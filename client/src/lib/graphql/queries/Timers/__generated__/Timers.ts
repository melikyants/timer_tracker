/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Timers
// ====================================================

export interface Timers_timers_timers_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string | null;
}

export interface Timers_timers_timers {
  __typename: "Timer";
  id: string;
  title: string;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  project: Timers_timers_timers_project | null;
  isRunning: boolean;
}

export interface Timers_timers {
  __typename: "TimerConnection";
  cursor: string;
  hasMore: boolean;
  timers: (Timers_timers_timers | null)[];
}

export interface Timers {
  timers: Timers_timers;
}

export interface TimersVariables {
  cursor?: string | null;
}
