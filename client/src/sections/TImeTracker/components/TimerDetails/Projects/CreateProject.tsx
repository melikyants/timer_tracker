import React from 'react'
import { Popper } from '../../Popper';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { useInput, useTextarea } from '../../../../../lib'
import { PROJECTS } from '../../../../../lib/graphql/query'
import { CREATE_PROJECT } from '../../../../../lib/graphql/mutation'

export const CreateProjectPopper = () => {
  const buttonProjectCreateRef = React.useRef(null);
  const buttonProjectCreatePopperRef = React.useRef(null);
  const [visibleProject, setVisibilityProject] = React.useState(false);
  const { value: title, setValue: setTitle, reset: resetTitle, bind: bindTitle } = useInput('')
  const { value: description, setValue: setDescription, reset: resetDescription, bind: bindDescription } = useTextarea('')

  const [createProject] = useMutation(CREATE_PROJECT, {
    update(cache, { data: { createProject } }) {
      const { projects } = cache.readQuery<any>({ query: PROJECTS });
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
        description
      }
    })
    setVisibilityProject(!visibleProject);
  }

  return (
    <div>
      <button ref={buttonProjectCreateRef} onClick={handleShowPopperForCreateProject} type="button" className="btn ">Create a project</button>
      <Popper
        refEl={buttonProjectCreateRef}
        popperRef={buttonProjectCreatePopperRef}
        visible={visibleProject}>
        <div className="createProject">
          <div className="createProject__header">
            <button onClick={closeProjectCreation} type="button" className="btn ">Cancel</button>
            <button onClick={onCreateProject} type="button" className="btn ">Save</button>
          </div>
          <div className="createProject__body" >
            <input type="text" {...bindTitle} name="title" placeholder="Name your project" className="input" />
            <textarea {...bindDescription} name="description" placeholder="Description" className="textarea" />
          </div>
        </div>
      </Popper>
    </div>
  );
};