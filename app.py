from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from db_config import db, db_init
from task_routes import task_blueprint
from dotenv import load_dotenv  # Import for loading environment variables
import os  # Import for environment variable handling

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and migrations
db_init(app)  # Use the centralized database initialization
migrate = Migrate(app, db)

# Set up CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Register blueprints
app.register_blueprint(task_blueprint)

# Root route for base URL access
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Taskify API!"})

if __name__ == '__main__':
    app.run(debug=True)
