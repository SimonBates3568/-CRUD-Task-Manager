import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Heading,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  Checkbox,
  useToast,
  IconButton
} from '@chakra-ui/react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching tasks',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/api/tasks', {
        title: newTask
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      toast({
        title: 'Task added',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding task',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      toast({
        title: 'Error updating task',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      toast({
        title: 'Task deleted',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error deleting task',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading>Task Manager</Heading>
        
        <form onSubmit={addTask} style={{ width: '100%' }}>
          <HStack>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              size="lg"
            />
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              px={8}
            >
              Add
            </Button>
          </HStack>
        </form>

        <VStack
          spacing={4}
          align="stretch"
          w="100%"
        >
          {tasks.map(task => (
            <Box
              key={task.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
              shadow="sm"
            >
              <HStack spacing={4}>
                <Checkbox
                  isChecked={task.completed}
                  onChange={() => toggleTask(task)}
                  size="lg"
                />
                <Text
                  flex="1"
                  textDecoration={task.completed ? 'line-through' : 'none'}
                  color={task.completed ? 'gray.500' : 'black'}
                >
                  {task.title}
                </Text>
                <Button
                  onClick={() => deleteTask(task.id)}
                  colorScheme="red"
                  size="sm"
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
}

export default App;