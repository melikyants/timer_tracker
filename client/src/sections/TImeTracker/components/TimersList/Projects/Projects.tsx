import React from 'react'
import { Popper } from '../../Popper';
import { CreateProjectPopper } from './CreateProject'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

import { Projects as IProjects } from './__generated__/Projects'

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
    }
  }
`

const TIMERS = gql`
  query Timers {
    timers {
      id
      title
      project_id
      type
      notes
      description
    }
  }
`;
export const Projects = ({ timerId }: { timerId: string }) => {
  console.log("Projects -> timerId", timerId)
  const {
    data: projectsData, loading, error, refetch,
  } = useQuery<IProjects>(PROJECTS);
  const {
    data: timersData, refetch: refetchTimers,
  } = useQuery(TIMERS);
  const [assignProject] = useMutation(ASSIGN_PROJECT)

  const inputProjectRef = React.useRef(null);
  const inputProjectPopperRef = React.useRef(null);

  const [visible, setVisibility] = React.useState(false);
  const [projectName, setprojectName] = React.useState('Project name')

  const projectsList = projectsData ? projectsData.projects : []

  const showProjects = () => {
    setVisibility(!visible);
  };

  const onSelectProject = async (id: string) => {
    console.log("onSelectProject -> id", id)
    await assignProject({ variables: { timer_id: timerId, id } })
    setprojectName(id)
    setVisibility(false);
    refetchTimers()
  }

  return (
    <div>
      <input name="project" placeholder="select a project" defaultValue={projectName} ref={inputProjectRef} onClick={showProjects} />
      <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
        <div>
          <ul>
            {projectsList.map((project) => (<li key={project.id} onClick={(e) => onSelectProject(project.id)}>{project.title}</li>))}
          </ul>
          <CreateProjectPopper />
        </div>
      </Popper>
    </div>

  )
}
