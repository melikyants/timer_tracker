import React from "react";
import { Popper } from "../../Popper";
import { CreateProjectPopper } from "./CreateProject";

import { useQuery, useMutation } from "@apollo/react-hooks";

import { Projects as IProjects } from "../../../../lib/graphql/queries/Projects/__generated__/Projects";
import {
  deleteProject as IdeleteProject,
  deleteProjectVariables,
} from "../../../../lib/graphql/mutations/DeleteProject/__generated__/deleteProject";
import { Timer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";

import { useInput } from "../../../../lib";

import { PROJECTS } from "../../../../lib/graphql/queries";
import { DELETE_PROJECT } from "../../../../lib/graphql/mutations";
import { ReactComponent as DeleteIcon } from "../../../icons/delete.svg";

export const Projects = ({
  timer,
  onChangeProjectId,
}: {
  timer: Timer_timer;
  onChangeProjectId: (id: string, description: string | null) => void;
}) => {
  const { data: projectsData } = useQuery<IProjects>(PROJECTS);

  const [deleteProject] = useMutation<IdeleteProject, deleteProjectVariables>(
    DELETE_PROJECT,
    {
      update(store, { data }) {
        const projectsData = store.readQuery<IProjects>({ query: PROJECTS });

        if (projectsData) {
          const index = projectsData.projects.findIndex(
            (project) => project.id === data!.deleteProject.id
          );
          if (index > -1) {
            projectsData.projects.splice(index, 1);
          }
          store.writeQuery({
            query: PROJECTS,
            data: { projects: projectsData.projects },
          });
        }
      },
    }
  );

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const defaultValueProject = timer.project?.id
    ? timer.project.title
    : "Project name";
  const { setValue: setprojectName, bind: bindProject } = useInput(
    defaultValueProject
  );

  const projectsList = projectsData ? projectsData.projects : [];

  const onClickInputProject = () => {
    setVisibility(!visible);
  };

  const onDeleteProject = async (id: string) => {
    await deleteProject({ variables: { id } });
  };
  const onSelectProject = (
    id: string,
    title: string,
    description: string | null
  ) => {
    onChangeProjectId(id, description);
    setprojectName(title);
    setVisibility(false);
  };

  return (
    <div>
      <input
        className="input"
        name="project"
        placeholder="select a project"
        ref={inputProjectRef}
        onClick={onClickInputProject}
        {...bindProject}
      />
      <Popper
        refEl={inputProjectRef}
        popperRef={inputProjectPopperRef}
        visible={visible}
      >
        <div>
          <ul className="project_list">
            {projectsList.map((project) => (
              <li key={project.id} data-id={project.id}>
                <div
                  onClick={(e) =>
                    onSelectProject(
                      project.id,
                      project.title,
                      project.description
                    )
                  }
                >
                  {project.title}
                </div>
                <div>
                  <button
                    className="btn btn__icon"
                    onClick={() => onDeleteProject(project.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <CreateProjectPopper />
        </div>
      </Popper>
    </div>
  );
};
