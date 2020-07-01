/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: createTimer
// ====================================================

export interface createTimer_createTimer {
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

export interface createTimer {
  createTimer: createTimer_createTimer;
}

export interface createTimerVariables {
  start: number;
  title: string;
}
