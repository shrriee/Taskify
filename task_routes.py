from flask import Blueprint, request, jsonify
from db_config import db
from models import Task
import openai
import os
import json
from datetime import datetime

# Load the OpenAI API key from environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

task_blueprint = Blueprint('tasks', __name__, url_prefix='/api/tasks')

@task_blueprint.route('/', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

@task_blueprint.route('/', methods=['POST'])
def add_task():
    data = request.json
    task = Task(
        title=data.get('title'),
        description=data.get('description'),
        due_date=data.get('due_date'),
        completed=data.get('completed', False),
        personnel=",".join(data.get('personnel', [])) if isinstance(data.get('personnel'), list) else data.get('personnel', ""),
        reminders=",".join(data.get('reminders', [])) if isinstance(data.get('reminders'), list) else data.get('reminders', ""),
        progress=data.get('progress', '')  # Handle progress
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201

@task_blueprint.route('/nlp-task', methods=['POST'])
def create_task_with_ai():
    """
    This endpoint handles task creation via AI processing.
    Expected input: JSON payload with an 'input_text' key.
    """
    data = request.json
    input_text = data.get('input_text')

    if not input_text:
        return jsonify({"error": "No input text provided"}), 400

    try:
        # Request OpenAI to generate structured information from input text
        prompt = (
            f"Extract structured task details from the following input: '{input_text}'. "
            "Provide a response in the following JSON format:\n"
            "{\n"
            "  \"title\": \"<task title>\",\n"
            "  \"description\": \"<task description>\",\n"
            "  \"due_date\": \"<due date in YYYY-MM-DD format>\",\n"
            "  \"personnel\": [\"<name1>\", \"<name2>\"],\n"
            "  \"reminders\": [\"<reminder date-time in YYYY-MM-DDTHH:MM format>\"],\n"
            "  \"progress\": \"<task progress description>\"\n"
            "}"
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an assistant that extracts structured task details from input text."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )

        # Parse AI-generated structured data
        ai_response = response['choices'][0]['message']['content'].strip()
        try:
            structured_data = json.loads(ai_response)
        except json.JSONDecodeError:
            return jsonify({"error": "Failed to parse AI response into structured data"}), 500

        # Fallbacks and parsing logic to ensure all necessary fields are correctly extracted
        title = structured_data.get("title", "AI Generated Task")
        description = structured_data.get("description", "No description provided.")
        due_date = structured_data.get("due_date")
        personnel = structured_data.get("personnel", ["Unassigned"])
        reminders = structured_data.get("reminders", [])
        progress = structured_data.get("progress", "No progress specified.")

        # Ensure reminders are formatted properly (convert strings as needed)
        formatted_reminders = []
        for reminder in reminders:
            try:
                date_part, time_part = reminder.split('T')
                date_obj = datetime.strptime(date_part, "%Y-%m-%d")
                time_obj = datetime.strptime(time_part, "%H:%M")
                formatted_reminders.append(f"{date_obj.strftime('%Y-%m-%d')} at {time_obj.strftime('%I:%M %p')}")
            except ValueError:
                formatted_reminders.append(reminder)  # Keep original if parsing fails

        # Create a new task using extracted and formatted data
        task = Task(
            title=title,
            description=description,
            due_date=due_date,
            completed=False,
            personnel=", ".join(personnel),
            reminders=", ".join(formatted_reminders),
            progress=progress
        )

        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201

    except openai.error.OpenAIError as e:
        return jsonify({"error": f"OpenAI API error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@task_blueprint.route('/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return '', 204

@task_blueprint.route('/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    task = Task.query.get_or_404(task_id)
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.due_date = data.get('due_date', task.due_date)
    task.completed = data.get('completed', task.completed)
    task.personnel = ",".join(data.get('personnel', [])) if isinstance(data.get('personnel'), list) else task.personnel
    task.reminders = ",".join(data.get('reminders', [])) if isinstance(data.get('reminders'), list) else task.reminders
    task.progress = data.get('progress', task.progress)  # Handle progress
    db.session.commit()
    return jsonify(task.to_dict())
