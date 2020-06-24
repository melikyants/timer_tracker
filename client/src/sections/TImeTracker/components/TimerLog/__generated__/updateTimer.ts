/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: updateTimer
// ====================================================

export interface updateTimer_updateTimer {
  __typename: "Timer";
  id: string;
}

export interface updateTimer {
  updateTimer: updateTimer_updateTimer;
}

export interface updateTimerVariables {
  id: string;
  title: string;
}
