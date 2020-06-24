import React from 'react'
import {Popper} from '../../Popper'

export const TimerDetails = () => {
  const types = ['Study', 'Work', 'Hobbie']
  const inputProjectRef = React.useRef(null)
  const inputProjectPopperRef = React.useRef(null)

  const buttonProjectCreateRef = React.useRef(null)
  const buttonProjectCreatePopperRef = React.useRef(null)
  const [visible, setVisibility] = React.useState(false)
  const [visibleProject, setVisibilityProject] = React.useState(false)

  const showProjects = () => {
    setVisibility(!visible)
  }

  const projects = [{
    id: "001",
    title: "TimmerLog",
    info: "building timer for a personal use"
  },
  {
    id: "002",
    title: "Dashboard",
    info: "building dashbor to view all the usefull data"
  }]

  const handleCreateProject = () => {
    setVisibilityProject(!visibleProject)
    console.log('cloick')
  }
  const closeProjectCreation = () => {
    setVisibilityProject(!visibleProject)
  }
return (
  <div className="TimerDetails_wrapper">
    <h3>Details</h3>
    <div className="TimerDetails__body">
      <input placeholder="Title" className="input"/>
      <input name="project" placeholder="select a project" defaultValue="Project name" ref={inputProjectRef} onClick={showProjects}/>
    <Popper refEl={inputProjectRef} popperRef={inputProjectPopperRef} visible={visible}>
      <div>
        <ul>
          {projects.map((project)=>{
            return(<li key={project.id}>{project.title}</li>)
          })}
        </ul>
        <button ref={buttonProjectCreateRef} onClick={handleCreateProject}>Create a project</button>
        <Popper refEl={buttonProjectCreateRef} popperRef={buttonProjectCreatePopperRef} visible={visibleProject}>
          <div>
            <button onClick={closeProjectCreation}>Cancel</button></div>
        </Popper>
      </div>
    </Popper>
      {types.map((type, i)=>{
        return(
          <label key={i}>
          {type}
        <input type="checkbox" name={type}/>
      </label>
        )
      })}
        
    </div>
  </div>
)
}