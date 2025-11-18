// src/TodoList.tsx
import type { Todo } from "./types";

type Props = {
    todos: Todo[];
};

const TodoList = ({ todos }: Props) => {
    return (
        <ul className="space-y-2">
            {todos.map((todo) => (
                <li key={todo.id} className="flex items-center justify-between rounded border p-2">
          <span className={todo.isDone ? "line-through text-gray-400" : ""}>
            {todo.name} (優先度: {todo.priority})
          </span>
                    <span>{todo.deadline.toLocaleDateString()}</span>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;