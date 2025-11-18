// src/initTodos.ts
import type { Todo } from "./types";
import { v4 as uuid } from "uuid";

export const initTodos: Todo[] = [
    {
        id: uuid(),
        name: "Reactを学習する",
        isDone: false,
        priority: 1,
        deadline: new Date(2025, 0, 31),
    },
    {
        id: uuid(),
        name: "Todoアプリを作る",
        isDone: true,
        priority: 2,
        deadline: new Date(2025, 1, 15),
    },
];