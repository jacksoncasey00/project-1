import { writable } from 'svelte/store';

export const taskData = writable([
  {
    id: "1",
    parentId: "-1",
    name: "Graduate College",
    dueDate: null,
    progress: 75,
    difficulty: 9,
    ordering: 1
  },
  {
    id: "2",
    parentId: "-1",
    name: "Get a Job",
    dueDate: null,
    progress: 25,
    difficulty: 5,
    ordering: 2
  },
  {
    id: "3",
    parentId: "-1",
    name: "Learn a New Language",
    dueDate: null,
    progress: 50,
    difficulty: 7,
    ordering: null
  },
  {
    id: "4",
    parentId: "-1",
    name: "Get in Shape",
    dueDate: null,
    progress: 20,
    difficulty: 5,
    ordering: null
  },
  {
    id: "5",
    parentId: "1",
    name: "Spring 2023",
    dueDate: null,
    progress: 100,
    difficulty: 6,
    ordering: 1
  },
  {
    id: "6",
    parentId: "1",
    name: "Fall 2023",
    dueDate: null,
    progress: 100,
    difficulty: 3,
    ordering: 2
  },
  {
    id: "7",
    parentId: "1",
    name: "Fall 2024",
    dueDate: null,
    progress: 20,
    difficulty: 6,
    ordering: 3
  },
  {
    id: "8",
    parentId: "7",
    name: "ICP HW",
    dueDate: null,
    progress: 60,
    difficulty: 3,
    ordering: null
  },
  {
    id: "9",
    parentId: "7",
    name: "UI Design HW",
    dueDate: null,
    progress: 20,
    difficulty: 4,
    ordering: null
  },
  {
    id: "10",
    parentId: "7",
    name: "AI Machine Learning HW",
    dueDate: null,
    progress: 40,
    difficulty: 2,
    ordering: null
  },
  {
    id: "11",
    parentId: "7",
    name: "Software Engineering HW",
    dueDate: null,
    progress: 30,
    difficulty: 7,
    ordering: null
  },
  {
    id: "12",
    parentId: "7",
    name: "Senior Design HW",
    dueDate: null,
    progress: 10,
    difficulty: 8,
    ordering: null
  },
  {
    id: "13",
    parentId: "8",
    name: "Module 1",
    dueDate: "2024-09-02T23:59",
    progress: 100,
    difficulty: 2,
    ordering: 1
  },
  {
    id: "14",
    parentId: "8",
    name: "Module 2",
    dueDate: "2024-09-09T23:59",
    progress: 100,
    difficulty: 3,
    ordering: 2
  },
  {
    id: "15",
    parentId: "8",
    name: "Module 3",
    dueDate: "2024-09-16T23:59",
    progress: 100,
    difficulty: 4,
    ordering: 3
  },
  {
    id: "16",
    parentId: "8",
    name: "Module 4",
    dueDate: "2024-09-23T23:59",
    progress: 35,
    difficulty: 6,
    ordering: 4
  },
  {
    id: "17",
    parentId: "8",
    name: "Module 5",
    dueDate: "2024-09-30T23:59",
    progress: 0,
    difficulty: 4,
    ordering: 5
  },
  {
    id: "18",
    parentId: "9",
    name: "Assignment 1",
    dueDate: "2024-09-02T23:59",
    progress: 100,
    difficulty: 2,
    ordering: 1
  },
  {
    id: "19",
    parentId: "9",
    name: "Assignment 2",
    dueDate: "2024-09-09T23:59",
    progress: 100,
    difficulty: 4,
    ordering: 2
  },
  {
    id: "20",
    parentId: "9",
    name: "Assignment 3",
    dueDate: "2024-09-16T23:59",
    progress: 100,
    difficulty: 3,
    ordering: 3
  },
  {
    id: "21",
    parentId: "9",
    name: "Project 1",
    dueDate: "2024-09-23T23:59",
    progress: 90,
    difficulty: 7,
    ordering: 4
  },
  {
    id: "22",
    parentId: "21",
    name: "Design",
    dueDate: "2024-09-16T23:59",
    progress: 100,
    difficulty: 5,
    ordering: 1
  },
  {
    id: "23",
    parentId: "21",
    name: "Code",
    dueDate: "2024-09-23T23:59",
    progress: 100,
    difficulty: 8,
    ordering: 2
  },
  {
    id: "24",
    parentId: "21",
    name: "Documentation",
    dueDate: "2024-09-24T23:59",
    progress: 100,
    difficulty: 6,
    ordering: 3
  },
  {
    id: "25",
    parentId: "21",
    name: "Presentation",
    dueDate: "2024-09-25T23:59",
    progress: 50,
    difficulty: 4,
    ordering: 4
  },
]);