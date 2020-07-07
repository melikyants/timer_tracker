export interface CreateProjectArgs {
  timer_id: string;
  title: string;
  description: string;
}

export interface UpdateProjectArgs {
  id: string;
  title: string;
  description: string;
}

export interface DeleteProjectArgs {
  id: string;
}
