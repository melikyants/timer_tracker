/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum TimerType {
  ANY = "ANY",
  HOBBIE = "HOBBIE",
  PERSONAL_PROJECT = "PERSONAL_PROJECT",
  STUDY = "STUDY",
  WORK = "WORK",
}

export interface LogInInput {
  code: string;
}

export interface Params {
  q?: string | null;
  skills?: (string | null)[] | null;
  paging?: string | null;
}

export interface connectUpworkInput {
  verifier: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
