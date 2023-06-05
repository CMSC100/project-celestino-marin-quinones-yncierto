import React from 'react';
import ReactDOM from 'react-dom/client';
import { redirect, createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './components/LogIn';
import SignUp from './components/SignUp';

import AdminRoot from './components/admin/AdminRoot'
import SideBar from './components/admin/global/Sidebar/SideBar';
import ApproverList from './components/admin/global/ApproverList';
import StudentApplications from './components/admin/global/StudentApplications';

import ApproverHomepage from './components/approver/ApproverHomepage';
import ApproverRoot from './components/approver/ApproverRoot';

import StudentHomepage from './components/student/StudentHomepage';
import StudentRoot from './components/student/StudentRoot'
import './index.css';
import Dashboard from './components/admin/Dashboard';

// Send a POST request to API to check if the user is logged in. Redirect the user to /student-homepage if already logged in
const checkIfLoggedInOnHome = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const { isLoggedIn, userType } = await res.json();
  console.log(userType)
  // if user is logged in, check for user type and redirect to appropriate page
  if (isLoggedIn) {
    if (userType === "student") return redirect("/student")
    else if (userType === "adviser" || userType === "officer") return redirect ("/approver")
    else if (userType === "admin") return redirect ("/admin/manage-student-apps")
    else {
      alert("Your account has not yet been approved.")
      return 0
    }
  }
  else return 0;
};


// Send a POST request to API to check if the user is a student, admin, or approver
// each user type has own function for each type of root routes
const checkIfLoggedInAsStudent = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const { isLoggedIn, userType } = await res.json();

  if (isLoggedIn && userType === "student") return true;
  else return redirect("/");
};

const checkIfLoggedInAsAdmin = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const { isLoggedIn, userType } = await res.json();

  if (isLoggedIn && userType === "admin") return true;
  else return redirect("/");
};

const checkIfLoggedInAsApprover = async () => {
  const res = await fetch("http://localhost:3001/checkifloggedin", 
  {
    method: "POST",
    credentials: "include"
  });

  const { isLoggedIn, userType } = await res.json();

  if (isLoggedIn && (userType === "adviser" || userType === "officer")) return true;
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
    path: '/admin',
    element: <AdminRoot />,
    children: [
      {
        path: '/admin/dashboard',
        element: <Dashboard />
      },
      {
        path: '/admin/manage-student-apps',
        element: <StudentApplications />
      },
      {
        path: '/admin/manage-approvers',
        element: <ApproverList />
      }
    ],
    loader: checkIfLoggedInAsAdmin
  },
  {
    path: '/approver',
    element: <ApproverRoot/>,
    children: [
      {
        path: '/approver',
        element: <ApproverHomepage />
      }
    ],
    loader: checkIfLoggedInAsApprover
  },
  {
    path: '/student',
    element: <StudentRoot />,
    children: [
      {
        path: "/student",
        element: <StudentHomepage />
      }
    ],
    loader: checkIfLoggedInAsStudent
  },
]);

// render the router to the page
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);