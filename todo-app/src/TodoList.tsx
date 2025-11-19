// src/TodoList.tsx
import type { Todo } from "./types";
import { useState } from "react";
import EditTodoDialog from "./EditTodoDialog";
import DeleteTodoDialog from "./DeleteTodoDialog";

type Props = {
    todos: Todo[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Todo>) => void;
};

const TodoList = ({ todos, onToggle, onDelete, onUpdate }: Props) => {
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

    if (todos.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center text-gray-400">
                タスクがありません
            </div>
        );
    }

    const getPriorityColor = (priority: number) => {
        switch (priority) {
            case 1: return "text-red-600 font-semibold";
            case 2: return "text-yellow-600 font-medium";
            case 3: return "text-green-600";
            default: return "text-gray-600";
        }
    };

    const getPriorityBadge = (priority: number) => {
        switch (priority) {
            case 1: return "bg-red-100 text-red-700";
            case 2: return "bg-yellow-100 text-yellow-700";
            case 3: return "bg-green-100 text-green-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const isOverdue = (deadline: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deadlineDate = new Date(deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        return deadlineDate < today;
    };

    return (
        <>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md ${
                            todo.isDone ? "opacity-60" : ""
                        }`}
                    >
                        <div className="flex items-start gap-3">
                            {/* チェックボックス */}
                            <input
                                type="checkbox"
                                checked={todo.isDone}
                                onChange={() => onToggle(todo.id)}
                                className="mt-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                                aria-label={`${todo.name}を${todo.isDone ? '未完了' : '完了'}にする`}
                            />

                            <div className="flex-1 space-y-2">
                                {/* タスク名 */}
                                <p
                                    className={`text-lg ${
                                        todo.isDone ? "line-through text-gray-400" : "text-gray-800"
                                    }`}
                                >
                                    {todo.name}
                                </p>

                                {/* 優先度と期限 */}
                                <div className="flex flex-wrap items-center gap-2">
                                    {/* 優先度バッジ */}
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityBadge(
                                            todo.priority
                                        )}`}
                                    >
                                        優先度: {todo.priority}
                                    </span>

                                    {/* 期限 */}
                                    <time
                                        dateTime={todo.deadline.toISOString()}
                                        className={`text-sm ${
                                            !todo.isDone && isOverdue(todo.deadline)
                                                ? "font-semibold text-red-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        📅 {todo.deadline.toLocaleDateString()}
                                        {!todo.isDone && isOverdue(todo.deadline) && " (期限切れ)"}
                                    </time>
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingTodo(todo)}
                                    className="rounded bg-blue-500 px-3 py-1 text-sm text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label={`${todo.name}を編集`}
                                >
                                    編集
                                </button>
                                <button
                                    onClick={() => setDeletingTodo(todo)}
                                    className="rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    aria-label={`${todo.name}を削除`}
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* 編集ダイアログ */}
            {editingTodo && (
                <EditTodoDialog
                    todo={editingTodo}
                    isOpen={!!editingTodo}
                    onClose={() => setEditingTodo(null)}
                    onSave={onUpdate}
                />
            )}

            {/* 削除確認ダイアログ */}
            {deletingTodo && (
                <DeleteTodoDialog
                    todo={deletingTodo}
                    isOpen={!!deletingTodo}
                    onClose={() => setDeletingTodo(null)}
                    onConfirm={() => onDelete(deletingTodo.id)}
                />
            )}
        </>
    );
};

export default TodoList;