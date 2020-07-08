/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: startTimer
// ====================================================

export interface startTimer_startTimer_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string | null;
}

export interface startTimer_startTimer {
  __typename: "Timer";
  id: string;
  title: string;
  project: startTimer_startTimer_project | null;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  isRunning: boolean;
}

export interface startTimer {
  startTimer: startTimer_startTimer;
}

export interface startTimerVariables {
  start: number;
  id: string;
}
