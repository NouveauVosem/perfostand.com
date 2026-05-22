import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home/Home'
import ConceptPage from '../pages/ConceptPage/ConceptPage'
import NotFound from '../pages/NotFound/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'concepts/:id', element: <ConceptPage /> },
      { path: ':slug', element: <ConceptPage /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
