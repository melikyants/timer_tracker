import React from "react";
import { PopperButton } from "../../Popper";

import { useMutation } from "@apollo/react-hooks";

import { useInput, useTextarea } from "../../../../lib/Hooks";
import { Input, Button, Textarea } from "../../../../lib/components";

import { PROJECTS } from "../../../../lib/graphql/queries";
import { CREATE_PROJECT } from "../../../../lib/graphql/mutations";
import { Projects } from "../../../../lib/graphql/queries/Projects/__generated__/Projects";
import {
  createProject as IcreateProject,
  createProjectVariables,
} from "../../../../lib/graphql/mutations/CreateProject/__generated__/createProject";

export const CreateProjectPopper = () => {
  const [visible, setVisible] = React.useState(false);
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

  const closeProjectCreation = () => {
    setVisible(false);
  };

  const onCreateProject = () => {
    createProject({
      variables: {
        title,
        description,
      },
    });
    setVisible(!visible);
  };

  return (
    <PopperButton
      buttonTitle="Create a project"
      visible={visible}
      setVisible={setVisible}
    >
      <div className="createProject">
        <div className="createProject__header">
          <Button text="cancel" type="button" onClick={closeProjectCreation} />
          <Button text="save" type="button" onClick={onCreateProject} />
        </div>
        <div className="createProject__body">
          <Input
            type="text"
            bind={bindTitle}
            name="title"
            placeholder="Name your project"
          />
          <Textarea
            bind={bindDescription}
            name="description"
            placeholder="Description"
          />
        </div>
      </div>
    </PopperButton>
  );
};
