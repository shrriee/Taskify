import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function TaskForm({ onAddTask, taskToEdit, onEditSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [personnel, setPersonnel] = useState('');
  const [reminder, setReminder] = useState('');
  const [progress, setProgress] = useState(''); // New state for Task Progress

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.due_date);
      setPersonnel(taskToEdit.personnel.join(', '));
      setReminder(taskToEdit.reminders.join(', '));
      setProgress(taskToEdit.progress || ''); // Set existing progress if available
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const personnelList = personnel.split(',').map(name => name.trim());
    const reminderList = reminder.split(',').map(rem => rem.trim());
    const newTask = {
      title,
      description,
      due_date: dueDate,
      personnel: personnelList,
      reminders: reminderList,
      completed: false,
      progress // Include progress in the new task
    };
    if (taskToEdit) {
      onEditSubmit({ ...taskToEdit, ...newTask });
    } else {
      onAddTask(newTask);
    }
    setTitle('');
    setDescription('');
    setDueDate('');
    setPersonnel('');
    setReminder('');
    setProgress(''); // Clear progress after submission
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Other form fields */}
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formDueDate">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formPersonnel">
        <Form.Label>Assign to (Names)</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Name(s) separated by commas"
          value={personnel}
          onChange={(e) => setPersonnel(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formReminder">
        <Form.Label>Set Reminder</Form.Label>
        <Form.Control
          type="datetime-local"
          value={reminder}
          onChange={(e) => setReminder(e.target.value)}
        />
      </Form.Group>
      {/* New Task Progress field */}
      <Form.Group controlId="formProgress">
        <Form.Label>Task Progress</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter progress details"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        {taskToEdit ? 'Update Task' : 'Add Task'}
      </Button>
    </Form>
  );
}

export default TaskForm;
