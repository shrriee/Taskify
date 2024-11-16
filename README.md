Overview
Taskify is a comprehensive web-based task management application aimed at enhancing productivity for both individuals and teams. 
Taskify offers a range of features, including task creation, editing, deletion, categorization, prioritization, due dates, reminders, and secure user authentication. 
Designed for simplicity and effectiveness, it provides an intuitive platform for users to manage their tasks efficiently and collaboratively.

Features
Task Management: Create, update, delete, and categorize tasks with ease.
User Authentication: Offers secure login and user-specific task views.
NLP Integration: Utilizes Natural Language Processing (NLP) for creating tasks through intuitive user input.
Reminders: Stay on track with reminders and deadline notifications.
Responsive Design: Developed with React.js for a highly responsive and user-friendly interface.
Backend API: Powered by Flask (Python) and SQLite (or PostgreSQL for more robust setups).

Prerequisites:
Node.js
Python 3.x
Flask (Python)
SQLite or PostgreSQL (if configured)
Git (version control)

Installation Guide
Cloning the Repository
Use the following command to clone the repository:
git clone https://github.com/shrriee/Taskify.git

Navigate to the cloned directory:
cd Taskify

Setting Up the Backend
Create and activate a virtual environment:
python -m venv venv
.\venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Create an .env file with necessary environment variables, for example:
OPENAI_API_KEY=your_openai_api_key
FLASK_APP=app.py
FLASK_ENV=development

or you can use the .env attached.

Start the backend server:
flask run

Setting Up the Frontend:
Navigate to the frontend directory:
cd taskify-app/taskify-frontend
Install dependencies:
npm install
Start the development server:
npm start

Running the Application
Access the frontend by navigating to http://localhost:3000 in your web browser.
The backend API is accessible at http://localhost:5000.
