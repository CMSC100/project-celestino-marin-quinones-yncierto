import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './components/LogIn';
import SignUp from './components/student/SignUp';
import StudentHomepage from './components/student/StudentHomepage';

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/student-homepage", element: <StudentHomepage />}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);