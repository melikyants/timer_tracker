/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: startTimer
// ====================================================

export interface startTimer_startTimer {
  __typename: "Timer";
  id: string;
  title: string;
  project_id: string | null;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  project_title: string;
  project_description: string | null;
  isRunning: boolean;
}

export interface startTimer {
  startTimer: startTimer_startTimer;
}

export interface startTimerVariables {
  start: number;
  id: string;
}
