from db_config import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    due_date = db.Column(db.String(50), nullable=True)
    completed = db.Column(db.Boolean, default=False)
    personnel = db.Column(db.String(200), nullable=True)  # Store as comma-separated string
    reminders = db.Column(db.String(200), nullable=True)  # Store as comma-separated string
    progress = db.Column(db.String(200), nullable=True)  # New field for task progress

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "due_date": self.due_date,
            "completed": self.completed,
            "personnel": self.personnel.split(',') if self.personnel else [],
            "reminders": self.reminders.split(',') if self.reminders else [],
            "progress": self.progress  # Include progress in dictionary
        }
