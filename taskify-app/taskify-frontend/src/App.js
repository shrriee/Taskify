import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  const handleLogin = () => {
    if (username === 'Shrriee' && pin === '123456') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  const fetchTasks = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/tasks/');
    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    }
  };

  const handleAddTask = async (newTask) => {
    const response = await fetch('http://127.0.0.1:5000/api/tasks/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (response.ok) {
      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
    }
  };

  const handleDeleteTask = async (taskId) => {
    await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, { method: 'DELETE' });
    setTasks(tasks.filter((task) => task.id !== taskId));
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleUpdateTask = async (updatedTask) => {
    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
    if (response.ok) {
      const data = await response.json();
      setTasks(tasks.map((task) => (task.id === data.id ? data : task)));
    }
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
  };

  const handleEditSubmit = (updatedTask) => {
    handleUpdateTask(updatedTask);
    setTaskToEdit(null);
  };

  const handleAiInputChange = (e) => {
    setAiInput(e.target.value);
  };

  const handleAiTaskCreation = async () => {
    const response = await fetch('http://127.0.0.1:5000/api/tasks/nlp-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input_text: aiInput }),
    });

    if (response.ok) {
      const createdTask = await response.json();
      setAiResponse(createdTask);
      setTasks([...tasks, createdTask]);
    } else {
      alert('Failed to create task using AI.');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">Login</h2>
        <Form>
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPin">
            <Form.Label>PIN</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Taskify</h1>

      {/* AI Input Section */}
      <Row className="mb-3">
        <Col>
          <h3>Let AI do the job!</h3>
          <Form.Group controlId="formAiInput">
            <Form.Label>Enter your task description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Describe your task in natural language"
              value={aiInput}
              onChange={handleAiInputChange}
            />
          </Form.Group>
          <Button variant="primary" onClick={handleAiTaskCreation}>
            Create Task with AI
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <TaskForm onAddTask={handleAddTask} taskToEdit={taskToEdit} onEditSubmit={handleEditSubmit} />
        </Col>
      </Row>

      <Row>
        <Col>
          <TaskList
            tasks={tasks}
            onDelete={(task) => {
              setShowModal(true);
              setTaskToDelete(task);
            }}
            onUpdate={handleUpdateTask}
            onEdit={handleEditTask}
          />
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteTask(taskToDelete.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
