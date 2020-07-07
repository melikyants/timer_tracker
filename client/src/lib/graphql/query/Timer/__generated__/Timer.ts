/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Timer
// ====================================================

export interface Timer_timer_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string | null;
}

export interface Timer_timer {
  __typename: "Timer";
  id: string;
  title: string;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  project: Timer_timer_project | null;
  isRunning: boolean;
}

export interface Timer {
  timer: Timer_timer;
}

export interface TimerVariables {
  id: string;
}
