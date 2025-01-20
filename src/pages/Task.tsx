import React, { useState, useEffect } from "react";
import axios from "../utils/axiosConfig";
import { useForm } from "react-hook-form";
import InputComponent from "../component/input";
import { Button } from "primereact/button";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  _id?: any;
}

const TaskPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Task>();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/tasks"); // Assuming your backend returns tasks at this endpoint
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle adding a new task
  const onSubmit = async (e: Task) => {
    try {
      const newTask = {
        title: e.title,
        description: e.description,
        completed: false,
      };
      const response = await axios.post("/tasks", newTask);
      setValue("title", "");
      setValue("description", "");
      fetchTasks();
      // setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Handle task completion toggle
  const handleToggleCompletion = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      console.log(taskToUpdate, taskId, tasks);
      if (taskToUpdate) {
        const updatedTask = {
          ...taskToUpdate,
          completed: !taskToUpdate.completed,
        };
        await axios.put(`/tasks/${taskId}`, updatedTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId
              ? { ...task, completed: updatedTask.completed }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="flex align-items-center flex-column">
      <h2>Task Page</h2>
      <div className="w-30rem">
        <InputComponent
          register={register}
          errors={errors}
          name="title" // Specify field name
          label="Title"
          control={control}
          rule={{
            required: "Title is required",
          }}
        />
        <InputComponent
          control={control}
          rule={{ required: "Description is required" }}
          errors={errors}
          name="description"
          label="Description"
          type="text-area"
        />

        <Button
          label="Submit"
          type="button"
          className="p-button-primary"
          onClick={handleSubmit(onSubmit)}
        />
        {/* <button type="submit">Add Task</button> */}
      </div>

      {/* Task List */}
      <div>
        <h3>All Tasks</h3>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <div>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <button onClick={() => handleToggleCompletion(task._id)}>
                  {task.completed ? "Mark as Incomplete" : "Mark as Completed"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskPage;
