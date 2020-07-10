import React from "react";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { AUTH_URL_UPWORK, SEARCH_JOBS } from "../../lib/graphql/queries";
// import { LOG_IN_UPWORK } from "../../lib/graphql/mutations";

import { Viewer } from "../../lib/types";
import { CONNECT_UPWORK } from "../../lib/graphql/mutations";
import {
  connectUpwork as IconnectUpwork,
  connectUpworkVariables,
} from "../../lib/graphql/mutations/ConnectUpwork/__generated__/connectUpwork";

interface Props {
  setViewer: (viewer: Viewer) => void;
  viewer: Viewer;
}

const params = {
  q: "Front end OR React AND NOT wordpress AND NOT shopify AND NOT java",
  skills: ["css", "javascript"],
  paging: "0;100",
};
const listCountriesExclude = [
  "Ukraine",
  "Russia",
  "India",
  "Singapore",
  "Macedonia",
  "Romania",
  "Malaysia",
  "Guatemala",
  "Saudi Arabia",
  "United Arab Emirates",
  "Nigeria",
  "Pakistan",
  "Israel",
  "Czech Republic",
  "Australia",
  "South Africa",
];

export const Upwork = ({ setViewer, viewer }: Props) => {
  const client = useApolloClient();
  // const [jobs, setJobs] = React.useState([]);
  const { data } = useQuery(SEARCH_JOBS, {
    variables: {
      params,
      filterCountries: listCountriesExclude,
    },
  });

  const [
    connectUpwork,
    {
      data: connectUpworkData,
      loading: connectUpworkLoading,
      error: connectUpworkError,
    },
  ] = useMutation<IconnectUpwork, connectUpworkVariables>(CONNECT_UPWORK, {
    onCompleted: (data) => {
      console.log("Upwork -> data", data);
      // if (data && data.connectUpwork && data.connectUpwork.token) {
      setViewer(data.connectUpwork);
      // sessionStorage.setItem("token", data.connectUpwork.token);
      // displaySuccessNotification("You've successfully logged in!");
      // }
    },
  });

  const connectUpworkRef = React.useRef(connectUpwork);

  React.useEffect(() => {
    const oauth_verifier = new URL(window.location.href).searchParams.get(
      "oauth_verifier"
    );

    if (oauth_verifier) {
      connectUpworkRef.current({
        variables: {
          input: { verifier: oauth_verifier },
        },
      });
    }
  }, []);

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query({
        query: AUTH_URL_UPWORK,
      });
      console.log("handleAuthorize -> data", data);
      window.location.href = data.authUrlUpwork;
      const urlParams = new URLSearchParams(data.authUrl);
      const authVerifier = urlParams.get("oauth_verifier");
      console.log("handleAuthorize -> authVerifier", authVerifier);

      // const authUrl = data.authUrl.
    } catch {
      throw new Error(
        "Sorry! We weren't able to log you in. Please try again later!"
      );
    }
  };

  const jobs: any = data ? data.searchJobs : null;
  console.log("data", data);
  console.log("jobs", jobs);

  const handleSignOut = () => {};
  return (
    <div className="upwork-module">
      <div className="btn-block">
        {!viewer.tokenUpwork && (
          <div>
            <button className="btn" onClick={handleAuthorize}>
              Sign in with Upwork
            </button>
            <button className="btn" onClick={handleSignOut}>
              Sign out with Upwork
            </button>
            {/* <button className="btn" onClick={handleSearchJobs}>
              Search Jobs
            </button> */}
          </div>
        )}
      </div>
      <div className="upwork-jobs">
        {jobs &&
          jobs.map((job: any, index: number) => {
            return (
              <div key={index} className="job">
                <div className="job-title">
                  <a href={job.url} target="_blank">
                    {job.title}
                  </a>
                  <div>{job.client.country}</div>
                </div>
                <div>{job.snippet}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
