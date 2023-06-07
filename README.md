[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/qXKUO3-R)


# CMSC 100 Project - Aprub
Repository for a web development project in CMSC 100: Web Programming - 2nd Sem 2022-2023

## Members
- Kyla Cristine Celestino 
- Sean Joseph Marin
- John Lawrence Quiñones
- Reymond Yncierto

## Program Description

This program simulates a system for clearance approval in the Institute of Computer Science where one can open an application and submit a github link
to make it easier for the approver to review the repository and decide whether to approve or reject the application. ```WHAT IS THIS This program uses Flutter with Dart as its tech stack and 
utilizes the features of Firebase for their implementations; Cloud Firestore for the database, and Firebase Authentication for authentication. EDIT I2```
The program was split into two main components: Frontend for the UI elements, and the Backend for communicating with the remote database and authentication in MongoDB. 
The program is only suitable for the Android environment.

## Installation guide

1. Clone the repository locally using ```git clone```
2. Navigate to the project directory ```cd cmsc-100-project/frontend``` ```cmsc-100-project/backend```
3. Run ```npm install``` in frontend and backend directories to obtain the dependencies.

#### Deploying app in Android

Run ```npm start``` in frontend and backend directories and wait for it to start the developement server.

## How to use the app

#### As a Student
1. Create an account by tapping "Sign up"
2. Login with the created account's credentials and you will be redirected to your homepage
3. To open an application, click the "Open Application" button seen inside the sidebar
4. Fill in the application by inserting your github link then click the submit button
5. To view profile, simply click the "Profile" button in the sidebar
6. To logout, tap "Log out" button in the sidebar

#### As an Approver
1. The account for approver is created by the Admin
2. Login with the created account's credentials and you will be redirected to your homepage
3. Approve or reject (with remarks) an application. 
4. To logout, tap "Log out" button in the sidebar

    ##### Approver - Adviser
    1. To search for a specific student, type their name or student number in the search box
    2. Sort student applications by date (descending), or name (descending or ascending)
    3. Filter student applications by date, step, or status

    ##### Approver - Officer
    1. To search for a specific student, type their name or student number in the search box
    2. Sort student applications by date (descending), or name (descending or ascending)
    3. Filter student applications by adviser, date, step, or status


#### As an Admin
1. Login with admin account credentials and you will be redirected to your homepage
2. Can view students and pending accounts 
3. Can approve or reject student account application requests
4. Sort pending accounts or students by their full name or student number
5. 
