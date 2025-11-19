// src/types.ts
export type Todo = {
    id: string;
    name: string;
    isDone: boolean;
    priority: 1 | 2 | 3;
    deadline: Date;
};