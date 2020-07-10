import { gql } from "apollo-boost";
export const SEARCH_JOBS = gql`
  query SearchJobs($params: Params, $filterCountries: [String]) {
    searchJobs(params: $params, filterCountries: $filterCountries) {
      id
      title
      snippet
      category
      subcategory
      skills
      type
      budget
      duration
      workload
      status
      date_created
      url
      client {
        country
        feedback
        reviews_count
        jobs_posted
        past_hires
        payment_verification_status
      }
    }
  }
`;
