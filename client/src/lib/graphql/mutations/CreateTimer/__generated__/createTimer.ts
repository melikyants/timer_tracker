/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: createTimer
// ====================================================

export interface createTimer_createTimer_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string | null;
}

export interface createTimer_createTimer {
  __typename: "Timer";
  id: string;
  title: string;
  project: createTimer_createTimer_project | null;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  isRunning: boolean;
}

export interface createTimer {
  createTimer: createTimer_createTimer;
}

export interface createTimerVariables {
  start: number;
  title: string;
}
