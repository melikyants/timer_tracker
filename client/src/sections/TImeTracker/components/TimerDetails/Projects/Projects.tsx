import React from 'react'
import { Popper } from '../../Popper';
import { CreateProjectPopper } from './CreateProject'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Projects as IProjects } from './__generated__/Projects'
import { useInput } from '../../../../../lib'

const PROJECTS = gql`
  query Projects {
    projects {
      id
      title
      info
    }
  }
`;

const ASSIGN_PROJECT = gql`
  mutation AssignProject($timer_id: String!, $id: String!){
    assignProject(timer_id: $timer_id, id: $id){
      id
      project_title
    }
  }
`

export const Projects = ({ timer }: { timer: any }) => {
  // console.log("Projects -> timerId", timer)
  const {
    data: projectsData, loading, error, refetch: refetchProjects,
  } = useQuery<IProjects>(PROJECTS);

  const [assignProject] = useMutation(ASSIGN_PROJECT)

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const defaultValueProject = timer.project_id ? timer.project_title : 'Project name'
  const { value: projectName, setValue: setprojectName, bind: bindProject } = useInput(defaultValueProject)

  const projectsList = projectsData ? projectsData.projects : []

  const onClickInputProject = () => {
    setVisibility(!visible);
  };

  const updateState = (id: string) => {
    console.log("updateState -> id", id)
    const projectTitle = projectsList.filter(project => id === id)[0]
    setprojectName(id)
    setVisibility(false);
  }
  const onSelectProject = async (id: string) => {
    const timer_title: any = await assignProject({ variables: { timer_id: timer.id, id } })
    if (!timer_title) {
      throw new Error()
    }
    const timer_projectT = timer_title.data.assignProject.project_title
    await updateState(timer_projectT)
  }

  return (
    <div>
      <input className="input" name="project" placeholder="select a project" ref={inputProjectRef} onClick={onClickInputProject} {...bindProject} />
      <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
        <div>
          <ul className="project_list">
            {projectsList.map((project) => (<li key={project.id} data-id={project.id} onClick={(e) => onSelectProject(project.id)}>{project.title}</li>))}
          </ul>
          <CreateProjectPopper />
        </div>
      </Popper>
    </div>

  )
}
