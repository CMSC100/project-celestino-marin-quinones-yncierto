import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './components/LogIn';
import SignUp from './components/SignUp';

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/sign-up", element: <SignUp /> }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);