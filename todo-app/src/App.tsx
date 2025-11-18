// src/App.tsx
import { useState } from "react";
import type { Todo } from "./types";
import { initTodos } from "./initTodos";
import TodoList from "./TodoList";
import WelcomeMessage from "./WelcomeMessage";
import { v4 as uuid } from "uuid";

const App = () => {
    const [todos, setTodos] = useState<Todo[]>(initTodos);
    const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

    const addNewTodo = () => {
        const newTodo: Todo = {
            id: uuid(),
            name: "新しいタスク",
            isDone: false,
            priority: 3,
            deadline: new Date(2025, 10, 13),
        };
        setTodos([...todos, newTodo]);
    };

    return (
        <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
            <h1 className="mb-4 text-2xl font-bold">TodoApp</h1>
            <WelcomeMessage name="寝屋川タヌキ" uncompletedCount={uncompletedCount} />
            <TodoList todos={todos} />

            <div className="mt-5 space-y-2 rounded-md border p-3">
                <h2 className="text-lg font-bold">新しいタスクの追加</h2>
                <button
                    type="button"
                    onClick={addNewTodo}
                    className="rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600"
                >
                    追加
                </button>
            </div>
        </div>
    );
};

export default App;