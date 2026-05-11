import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../pages/Home/Home'
import NotFound from '../pages/NotFound/NotFound'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // add new pages here as children
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
