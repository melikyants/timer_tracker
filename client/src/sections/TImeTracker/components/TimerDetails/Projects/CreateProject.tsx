import React from "react";
import { Popper } from "../../Popper";

import { useMutation } from "@apollo/react-hooks";
import { useInput, useTextarea } from "../../../../../lib";
import { PROJECTS } from "../../../../../lib/graphql/query";
import { CREATE_PROJECT } from "../../../../../lib/graphql/mutation";
import { Projects } from "../../../../../lib/graphql/query/Projects/__generated__/Projects";
import {
  createProject as IcreateProject,
  createProjectVariables,
} from "../../../../../lib/graphql/mutation/CreateProject/__generated__/createProject";

export const CreateProjectPopper = () => {
  const buttonProjectCreateRef = React.useRef(null);
  const buttonProjectCreatePopperRef = React.useRef(null);
  const [visibleProject, setVisibilityProject] = React.useState(false);
  const { value: title, bind: bindTitle } = useInput("");
  const { value: description, bind: bindDescription } = useTextarea("");

  const [createProject] = useMutation<IcreateProject, createProjectVariables>(
    CREATE_PROJECT,
    {
      update(cache, { data }) {
        const dataProjects = cache.readQuery<Projects>({ query: PROJECTS });
        if (dataProjects) {
          cache.writeQuery({
            query: PROJECTS,
            data: {
              projects: dataProjects.projects.concat([data!.createProject]),
            },
          });
        }
      },
    }
  );

  const handleShowPopperForCreateProject = () => {
    setVisibilityProject(!visibleProject);
  };

  const closeProjectCreation = () => {
    setVisibilityProject(!visibleProject);
  };

  const onCreateProject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    createProject({
      variables: {
        title,
        description,
      },
    });
    setVisibilityProject(!visibleProject);
  };

  return (
    <div>
      <button
        ref={buttonProjectCreateRef}
        onClick={handleShowPopperForCreateProject}
        type="button"
        className="btn "
      >
        Create a project
      </button>
      <Popper
        refEl={buttonProjectCreateRef}
        popperRef={buttonProjectCreatePopperRef}
        visible={visibleProject}
      >
        <div className="createProject">
          <div className="createProject__header">
            <button
              onClick={closeProjectCreation}
              type="button"
              className="btn "
            >
              Cancel
            </button>
            <button onClick={onCreateProject} type="button" className="btn ">
              Save
            </button>
          </div>
          <div className="createProject__body">
            <input
              type="text"
              {...bindTitle}
              name="title"
              placeholder="Name your project"
              className="input"
            />
            <textarea
              {...bindDescription}
              name="description"
              placeholder="Description"
              className="textarea"
            />
          </div>
        </div>
      </Popper>
    </div>
  );
};
