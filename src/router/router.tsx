import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Messages from '../pages/Messages/Messages';
import Profile from '../pages/Profile/Profile';
import Users from '../pages/Users/Users';
import Login from '../pages/Login/Login';
import Error from '../pages/Error/Error';
import Home from '../pages/Home/Home';
import Sub from '../pages/Sub/Sub';
import Settings from 'pages/Settings/Settings';
import Register from 'pages/Register/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // loader: rootLoader,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/messages/:id?',
        element: <Messages />,
      },
      {
        path: '/profile/:id?',
        element: <Profile />,
      },
      {
        path: '/profile/:id/sub',
        element: <Sub />,
      },
      {
        path: '/users',
        element: <Users />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/registration',
        element: <Register />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
]);
