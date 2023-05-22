import React from 'react';
import ReactDOM from 'react-dom/client';
import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './components/LogIn';
import SignUp from './components/student/SignUp';
import StudentHomepage from './components/student/StudentHomepage';
import ApproverList from './components/admin/ApproverList';
import PdfModal from './components/modal/PdfModal';

// Send a POST request to API to check if the user is logged in. Redirect the user to /student-homepage if already logged in
const checkIfLoggedInOnHome = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const payload = await res.json();

  if (payload.isLoggedIn) return redirect("/student-homepage");
  else return 0;
};

// Send a POST request to API to check if the user is logged in. Redirect the user back to / if not logged in
const checkIfLoggedInOnDash = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const payload = await res.json();

  if (payload.isLoggedIn) return true;
  else return redirect("/");
  
};

// create a router that has all the routes defined. loader is called before the route is rendered
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: checkIfLoggedInOnHome
  },
  {
    path: '/sign-up',
    element: <SignUp />,
    loader: checkIfLoggedInOnHome
  },
  {
    path: '/student-homepage',
    element: <StudentHomepage />,
    loader: checkIfLoggedInOnDash
  },
  {
    path: '/approver-list',
    element: <ApproverList />,
  },
  {
    path: '/pdf-modal',
    element: <PdfModal />
  }
]);

// render the router to the page
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);