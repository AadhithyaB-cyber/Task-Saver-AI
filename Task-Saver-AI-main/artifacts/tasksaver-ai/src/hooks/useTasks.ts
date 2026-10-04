import { useState, useEffect } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO string YYYY-MM-DD
  completed: boolean;
  createdAt: string; // ISO string
};

const STORAGE_KEY = "tasksaver_tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load tasks from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to save tasks to local storage", error);
    }
  }, [tasks]);

  const addTask = (data: { title: string; description: string; deadline: string }) => {
    const newTask: Task = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      ...data,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    tasks,
    addTask,
    toggleTaskComplete,
    deleteTask,
  };
}
