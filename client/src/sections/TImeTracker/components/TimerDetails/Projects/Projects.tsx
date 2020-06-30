import React from 'react'
import { Popper } from '../../Popper';
import { CreateProjectPopper } from './CreateProject'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Projects as IProjects } from './__generated__/Projects'
import { useInput } from '../../../../../lib'

import { PROJECTS } from '../../../../../lib/graphql/query'
import { DELETE_PROJECT } from '../../../../../lib/graphql/mutation'
import { ReactComponent as DeleteIcon } from '../../../icons/delete.svg'

export const Projects = ({ timer, onChangeProjectId }: { timer: any, onChangeProjectId: any }) => {
  // console.log("Projects -> timerId", timer)
  const {
    data: projectsData, loading, error, refetch: refetchProjects,
  } = useQuery<IProjects>(PROJECTS);
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    update(cache, { data: { deleteProject } }) {
      const { projects } = cache.readQuery<any>({ query: PROJECTS })
      const index = projects.findIndex((project: any) => project.id === deleteProject.id)
      if (index > -1) {
        projects.splice(index, 1)
      }
      cache.writeQuery({
        query: PROJECTS,
        data: { projects: projects }
      })
    }
  })

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const defaultValueProject = timer.project_id ? timer.project_title : 'Project name'
  const { value: projectName, setValue: setprojectName, bind: bindProject } = useInput(defaultValueProject)

  const projectsList = projectsData ? projectsData.projects : []

  const onClickInputProject = () => {
    setVisibility(!visible);
  };

  const onDeleteProject = async (id: string) => {
    await deleteProject({ variables: { id } })
  }
  const onSelectProject = (id: string, title: string, description: string) => {
    onChangeProjectId(id, description)
    setprojectName(title)
    setVisibility(false);
  }

  return (
    <div>
      <input className="input" name="project" placeholder="select a project" ref={inputProjectRef} onClick={onClickInputProject} {...bindProject} />
      <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
        <div>
          <ul className="project_list">
            {projectsList.map((project) => (
              <li
                key={project.id}
                data-id={project.id}
              >
                <div onClick={(e) => onSelectProject(project.id, project.title, project.description)}>{project.title}</div>
                <div>
                  <button className="btn btn__icon" onClick={() => onDeleteProject(project.id)}><DeleteIcon /></button></div>
              </li>))}
          </ul>
          <CreateProjectPopper />
        </div>
      </Popper>
    </div>

  )
}
