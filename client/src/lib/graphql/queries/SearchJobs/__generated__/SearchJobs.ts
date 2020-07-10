/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { Params } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: SearchJobs
// ====================================================

export interface SearchJobs_searchJobs_client {
  __typename: "JobClient";
  country: string | null;
  feedback: number | null;
  reviews_count: number | null;
  jobs_posted: number | null;
  past_hires: number | null;
  payment_verification_status: string | null;
}

export interface SearchJobs_searchJobs {
  __typename: "Job";
  id: string | null;
  title: string | null;
  snippet: string | null;
  category: string | null;
  subcategory: string | null;
  skills: (string | null)[] | null;
  type: string | null;
  budget: number | null;
  duration: string | null;
  workload: string | null;
  status: string | null;
  date_created: string | null;
  url: string | null;
  client: SearchJobs_searchJobs_client | null;
}

export interface SearchJobs {
  searchJobs: SearchJobs_searchJobs[];
}

export interface SearchJobsVariables {
  params?: Params | null;
  filterCountries?: (string | null)[] | null;
}
