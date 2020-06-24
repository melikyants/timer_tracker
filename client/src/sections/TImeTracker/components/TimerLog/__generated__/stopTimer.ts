/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: stopTimer
// ====================================================

export interface stopTimer_stopTimer {
  __typename: "Timer";
  id: string;
}

export interface stopTimer {
  stopTimer: stopTimer_stopTimer;
}

export interface stopTimerVariables {
  id: string;
  end: number;
}
