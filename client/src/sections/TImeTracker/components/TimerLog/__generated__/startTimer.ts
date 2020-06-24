/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: startTimer
// ====================================================

export interface startTimer_startTimer {
  __typename: "Timer";
  id: string;
}

export interface startTimer {
  startTimer: startTimer_startTimer;
}

export interface startTimerVariables {
  start: number;
  title: string;
}
