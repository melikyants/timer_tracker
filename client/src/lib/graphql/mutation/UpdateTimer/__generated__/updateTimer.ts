/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TimerType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: updateTimer
// ====================================================

export interface updateTimer_updateTimer {
  __typename: "Timer";
  id: string;
  title: string;
  type: TimerType | null;
  notes: string | null;
  start: number;
  end: number | null;
  project_id: string | null;
  project_title: string;
  project_description: string | null;
  isRunning: boolean;
}

export interface updateTimer {
  updateTimer: updateTimer_updateTimer;
}

export interface updateTimerVariables {
  id: string;
  title?: string | null;
  project_id?: string | null;
  project_description?: string | null;
  notes?: string | null;
  type?: TimerType | null;
}
