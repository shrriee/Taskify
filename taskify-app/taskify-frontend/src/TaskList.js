import React, { useState } from 'react';
import { ListGroup, Button, FormControl } from 'react-bootstrap';

function TaskList({ tasks, onDelete, onUpdate, onEdit }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Helper function to filter tasks based on all fields
  const filterTasks = (task) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchValue) ||
      (task.description && task.description.toLowerCase().includes(searchValue)) ||
      (task.due_date && task.due_date.toLowerCase().includes(searchValue)) ||
      (task.personnel && task.personnel.join(', ').toLowerCase().includes(searchValue)) ||
      (task.reminders && task.reminders.join(', ').toLowerCase().includes(searchValue)) ||
      (task.progress && task.progress.toLowerCase().includes(searchValue))
    );
  };

  const filteredTasks = tasks.filter(filterTasks);

  // Helper function to format reminders
  const formatReminder = (reminder) => {
    if (!reminder || !reminder.includes('T')) return 'No reminder set';
    const [date, time] = reminder.split('T');
    if (!time) return `Reminder Set For: ${date}`;

    let [hour, minute] = time.split(':');
    let period = 'AM';

    hour = parseInt(hour, 10);
    if (hour >= 12) {
      period = 'PM';
      if (hour > 12) hour -= 12; // Convert to 12-hour format
    } else if (hour === 0) {
      hour = 12; // Midnight edge case
    }

    const formattedTime = `${hour}:${minute} ${period}`;
    return `Reminder Set For: ${date} at ${formattedTime}`;
  };

  return (
    <div>
      {/* Single search bar */}
      <FormControl
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <ListGroup>
        {filteredTasks.map((task) => (
          <ListGroup.Item key={task.id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.title}</h5>
              <p>Description: {task.description || 'No description'}</p>
              <p>Due Date: {task.due_date || 'No due date'}</p>
              <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
              {task.personnel && <p>Assigned to: {task.personnel.join(', ')}</p>}
              {task.reminders && task.reminders.length > 0 ? (
                <p>{formatReminder(task.reminders[0])}</p>
              ) : (
                <p>No reminder set</p>
              )}
              {/* Display Task Progress */}
              <p>Task Progress: {task.progress || 'No progress added'}</p>
            </div>
            <div>
              <Button variant="danger" className="mr-2" onClick={() => onDelete(task)}>
                Delete
              </Button>
              <Button
                variant={task.completed ? 'warning' : 'success'}
                onClick={() => onUpdate({ ...task, completed: !task.completed })}
              >
                {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
              </Button>
              <Button variant="primary" onClick={() => onEdit(task)}>
                Edit
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default TaskList;
