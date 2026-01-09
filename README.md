## Employee Leave & Attendance Management System

## Project Overview

-> This project is a Mini HR Management System that allows organizations to manage employee leave requests and daily attendance with proper role-based access control.

-> The system provides:

* Employee login to apply for leave and mark attendance
* Admin dashboard to approve/reject leave requests
* Secure authentication and authorization
* Clean and responsive frontend UI

-> Although the project is full stack, primary focus was given to frontend development, UI flow, state management, and integration with backend APIs.

## Tech Stack & Justification

-> Frontend

React (Vite) – Fast development experience and component-based architecture
React Router DOM – Clean routing for dashboards and protected routes
Tailwind CSS – Utility-first styling for responsive and modern UI
Axios – Simple and efficient API communication

👉 Chosen to build a scalable, clean, and responsive user interface, which aligns with frontend internship responsibilities.

-> Backend

Node.js & Express.js – REST API development
MongoDB & Mongoose – Flexible NoSQL database
JWT Authentication – Secure user authentication
bcryptjs – Password hashing

👉 Backend was implemented mainly to support frontend functionality and API integration.

## Installation Steps:

1. Clone the Repository:

git clone <repository-url>
cd project-folder

2. Backend Setup:

cd backend
npm install
npm run seed
npm run dev

Backend runs on: http://localhost:5000

3. Frontend Setup:

cd frontend
npm install
npm run dev

Frontend runs on: http://localhost:5173

-> Environment Variables:

* Backend (.env)

MONGO_URI=mongodb://localhost:27017/hr-management
JWT_SECRET=your_jwt_secret
PORT=5000

* Frontend (.env.local)

VITE_API_URL=http://localhost:5000/api

-> API Endpoints

* Authentication

Method	   Endpoint	      Purpose
POST       /auth/signup   Register new user
POST	   /auth/login	  User login
GET	       /auth/me	      Get logged-in user

* Leave Management

Method	          Endpoint          	Purpose
POST	          /leave/apply	        Apply for leave
GET	              /leave/my-leaves	    View own leaves
PUT	              /leave/:id	        Edit leave
DELETE	          /leave/:id	        Cancel leave
GET	              /leave/all	        Admin: view all leaves
PUT	              /leave/:id/approve	Admin: approve leave
PUT	              /leave/:id/reject  	Admin: reject leave

* Attendance

Method	               Endpoint	                      Purpose
POST	               /attendance/mark	Mark          attendance
GET	                   /attendance/my-attendance	  View own attendance
GET	                   /attendance/all	              Admin: view all attendance

-> Database Models

* User Model

name
email (unique)
password (hashed)
role (Admin / Employee)
leaveBalance

* Leave Model

userId (reference to User)
leaveType
startDate
endDate
totalDays
status (Pending / Approved / Rejected)

* Attendance Model

userId (reference to User)
date
status (Present / Absent)

* Relationships
One User → Many Leave records
One User → Many Attendance records

## Admin Credentials
Email: admin@company.com
Password: admin123

(Admin user is created using a seed script.)

## AI Tools Declaration

-> AI Tools Used

* ChatGPT

** How AI Was Used (Positively & Honestly)

Assisted in structuring backend APIs and boilerplate setup
Helped in debugging errors and understanding best practices
Assisted in UI layout ideas and component structuring
Helped optimize API integration patterns between frontend and backend

** Manual Work & Learning

Frontend UI implementation
State management and API integration
Role-based route protection
Business logic understanding
UI responsiveness and user flow

AI was used as a learning and productivity aid, not as a replacement for implementation or understanding.

## Known Limitations

No email notifications for leave approval
No pagination for large datasets
No automated test cases
UI focuses more on functionality than advanced animations

## Time Spent

Frontend development & UI integration: ~4 hours
Backend setup & API implementation: ~6 hours
Debugging & testing: ~1.5 hours
Documentation: ~0.5 hours

Total Time Spent: ~12 hours