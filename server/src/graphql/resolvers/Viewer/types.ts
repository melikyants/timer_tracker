export interface LogInArgs {
  input: { code: string } | null;
}

export interface ConnectUpworkArgs {
  input: { verifier: string };
}
export interface Job {
  id: string;
  title: string;
  snippet: string;
}
export interface SearchJobArgs {
  params: {
    q: string;
    skills: string[];
    paging: string;
  };
  filterCountries: string[];
}
