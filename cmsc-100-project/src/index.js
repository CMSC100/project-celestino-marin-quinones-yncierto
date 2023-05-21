import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {path: "/", element: <LogIn />},
  { path: "/signUp", element: <SignUp />},
  { path: "/admin/:userCode", element: <AdminRoot />, children: [
    { path: "/admin/:userCode", element: <AdminMain />},
    { path: "/admin/:userCode/manage-apps", element: <PendingApplications />},
    { path: "/admin/:userCode/show-approver", element: <ApproverList />},
  ]},
  { path: "/student/:userCode", element: <StudentRoot />, children: [
    { path: "/student/:userCode", element: <StudentMain />},
    
  ]},
  { path: "/approver/:userCode", element: <ApproverRoot />, children: [
    { path: "/approver/:userCode", element: <ApproverMain />},
    { path: "/approver/:userCode/infoSubmit/:studentCode", element: <StudentSubmittedInfo />},
    { path: "/approver/:userCode/remarks/:studentCode", element: <StudentRemarks />}
  ]}
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);