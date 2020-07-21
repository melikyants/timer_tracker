import React from "react";
import { PopperInput } from "../../../../lib/components/Popper";
import { CreateProjectPopper } from "./CreateProject";

import { useQuery, useMutation } from "@apollo/client";

import { Projects as IProjects } from "../../../../lib/graphql/queries/Projects/__generated__/Projects";
import {
  deleteProject as IdeleteProject,
  deleteProjectVariables,
} from "../../../../lib/graphql/mutations/DeleteProject/__generated__/deleteProject";
import { Timer_timer } from "../../../../lib/graphql/queries/Timer/__generated__/Timer";

import { useInput } from "../../../../lib/Hooks";
import { Button, Loading } from "../../../../lib/components";

import { PROJECTS } from "../../../../lib/graphql/queries";
import { DELETE_PROJECT } from "../../../../lib/graphql/mutations";

export const Projects = ({
  timer,
  onChangeProjectId,
}: {
  timer: Timer_timer;
  onChangeProjectId: (id: string, description: string | null) => void;
}) => {
  const { data: projectsData, loading, error } = useQuery<IProjects>(PROJECTS);
  const [visible, setVisible] = React.useState(false);

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

  const defaultValueProject = timer.project?.id
    ? timer.project.title
    : "Project name";

  const { setValue: setprojectName, bind: bindProject } = useInput(
    defaultValueProject
  );

  const projectsList = projectsData ? projectsData.projects : [];

  const onDeleteProject = async (id: string) => {
    console.log("onDeleteProject -> id", id);
    await deleteProject({ variables: { id } });
  };

  const onSelectProject = (
    id: string,
    title: string,
    description: string | null
  ) => {
    onChangeProjectId(id, description);
    setprojectName(title);
    setVisible(false);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const projectError = error ? (
    <div>
      <h4>Uh oh! Something went wrong - please try again later :(</h4>
    </div>
  ) : null;

  return (
    <div>
      <PopperInput
        inputName="project"
        inputPlaceholder="select a project"
        bindInput={bindProject}
        visible={visible}
        setVisible={setVisible}
      >
        {projectError}
        <div className="popper__children">
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
                <Button
                  icon="delete"
                  simpleIcon
                  onClick={() => onDeleteProject(project.id)}
                />
              </li>
            ))}
          </ul>
          <CreateProjectPopper />
        </div>
      </PopperInput>
    </div>
  );
};
