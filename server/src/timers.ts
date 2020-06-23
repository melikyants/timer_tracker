interface Timer {
  id: string,
  title: string,
  project_id: string,
  category: string,
  description: string,
  notes: string,
  elapsed: number,
  runningSince: number,
  images: string
}

interface Timers_Projects {
  id: string,
  title: string,
  info: string
}
export const timers: Timer[] = [
  {
    id: "001",
    title: "module 8",
    project_id: "001", //dropdown list with timer projects and automaticaly create if its something new
    category: "study", //dropdown list with timer categories
    description: 'learning graphql and connecting apollo server',
    notes: 'usefull links: ',
    elapsed: 0,
    runningSince: 0,
    images: 'https://res.cloudinary.com/tiny-house/image/upload/v1560641352/mock/Toronto/toronto-listing-1_exv0tf.jpg', // ? attached files, images used in the project
  },
  {
    id: "002",
    title: "drawing heads",
    project_id: "003",
    category: "hobbie", //dropdown list with timer categories
    description: 'different head rotation',
    notes: 'references i used: http://google.com/drawings, http://google.com/pinterest',
    elapsed: 0,
    runningSince: 0,
    images: 'https://res.cloudinary.com/tiny-house/image/upload/v1560641352/mock/Toronto/toronto-listing-1_exv0tf.jpg', // ?
  },
]

export const timers_projects: Timers_Projects[] = [
  {
    id: "001",
    title: "TinyHouse",
    info: "React and typescript project with Graphql, Mongodb, Apollo" //links related to the project, or some other extra info, related only to the project itself
  },
  {
    id: "002",
    title: "LearnJs",
    info: ""
  },
  {
    id: "003",
    title: "practice drawing",
    info: ""
  }
]


/*not sure if needed, can add it on the client side, as its probably goona be only 3 categories,
which is: Work, Study, Hobbie
1. First iteration will do categories on the client side, and later will see if its needed
*/
// export const timers_categories = [
//   {
//     id: "001",
//     title: "Work"
//   }
// ]