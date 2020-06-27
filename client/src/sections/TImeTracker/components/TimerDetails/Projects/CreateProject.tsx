import React from 'react'
import { Popper } from '../../Popper';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { useInput } from '../../../../../lib'

const CREATE_PROJECT = gql`
  mutation createProject($title: String!, $info:String){
    createProject(title: $title, info: $info){
      id
      title
      info
    }
  }
`
const PROJECTS = gql`
  query Projects {
    projects {
      id
      title
      info
    }
  }
`;

export const CreateProjectPopper = () => {
  const buttonProjectCreateRef = React.useRef(null);
  const buttonProjectCreatePopperRef = React.useRef(null);
  const [visibleProject, setVisibilityProject] = React.useState(false);
  const { value: title, setValue: setTitle, reset: resetTitle, bind: bindTitle } = useInput('')
  const { value: info, setValue: setInfo, reset: resetInfo, bind: bindInfo } = useInput('')

  const [createProject] = useMutation(CREATE_PROJECT, {
    update(cache, { data: { createProject } }) {
      const { projects } = cache.readQuery<any>({ query: PROJECTS });
      console.log("update -> projects", projects)
      console.log("update -> createProject", createProject)
      cache.writeQuery({
        query: PROJECTS,
        data: { projects: projects.concat([createProject]) },
      });
    }
  })

  const handleShowPopperForCreateProject = () => {
    setVisibilityProject(!visibleProject);
    console.log('cloick');
  };
  const closeProjectCreation = () => {
    setVisibilityProject(!visibleProject);
  };

  const onCreateProject = (e: any) => {
    e.preventDefault()
    createProject({
      variables: {
        title,
        info
      }
    })
    setVisibilityProject(!visibleProject);
  }

  return (
    <div>
      <button ref={buttonProjectCreateRef} onClick={handleShowPopperForCreateProject} type="button">Create a project</button>
      <Popper
        refEl={buttonProjectCreateRef}
        popperRef={buttonProjectCreatePopperRef}
        visible={visibleProject}>
        <div className="createProject">
          <div className="createProject__header">
            <button onClick={closeProjectCreation} type="button">Cancel</button>
            <button onClick={onCreateProject} type="button">Save</button>
          </div>
          <div className="createProject__body" >
            <input type="text" {...bindTitle} name="title" placeholder="Name your project" />
            <input type="text" {...bindInfo} name="info" placeholder="Additional info" />
          </div>
        </div>
      </Popper>
    </div>
  );
};