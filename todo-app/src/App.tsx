// src/App.tsx
import { useState, useEffect } from "react";
import type { Todo } from "./types";
import TodoList from "./TodoList";
import WelcomeMessage from "./WelcomeMessage";
import { v4 as uuid } from "uuid";
import { loadTodos, saveTodos } from "./todoStorage";

const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoName, setNewTodoName] = useState("");
    const [newTodoPriority, setNewTodoPriority] = useState<1 | 2 | 3>(3);
    const [newTodoDeadline, setNewTodoDeadline] = useState("");
    const [showCompleted, setShowCompleted] = useState(true);
    const [isComposing, setIsComposing] = useState(false); // IME変換中か
    const [isLoaded, setIsLoaded] = useState(false); // データが読み込まれたか

    // 初回マウント時にLocalStorageからデータを読み込む
    useEffect(() => {
        const loadedTodos = loadTodos();
        setTodos(loadedTodos);
        setIsLoaded(true);
    }, []);

    // todosが変更されたらLocalStorageに保存
    useEffect(() => {
        // 初回レンダリング時は保存しない
        if (!isLoaded) return;
        saveTodos(todos);
    }, [todos]);

    const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

    const addNewTodo = () => {
        if (!newTodoName.trim()) {
            alert("タスク名を入力してください");
            return;
        }

        const deadline = newTodoDeadline
            ? new Date(newTodoDeadline)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const newTodo: Todo = {
            id: uuid(),
            name: newTodoName.trim(),
            isDone: false,
            priority: newTodoPriority,
            deadline,
        };

        setTodos([...todos, newTodo]);
        setNewTodoName("");
        setNewTodoPriority(3);
        setNewTodoDeadline("");
    };

    const toggleTodo = (id: string) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const updateTodo = (id: string, updates: Partial<Todo>) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, ...updates } : todo
            )
        );
    };

    // 表示するTodoをフィルタリング
    const displayTodos = showCompleted
        ? todos
        : todos.filter((todo) => !todo.isDone);

    // 優先度でソート
    const sortedTodos = [...displayTodos].sort((a, b) => {
        if (a.isDone !== b.isDone) return a.isDone ? 1 : -1;
        return a.priority - b.priority;
    });

    return (
        <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
            {/* ヘッダー */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-800">TodoApp</h1>
            </div>

            <WelcomeMessage name="ユーザー" uncompletedCount={uncompletedCount} />

            {/* 完了タスクの表示切替 */}
            <div className="mb-4 flex items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
                <input
                    id="show-completed"
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500"
                />
                <label htmlFor="show-completed" className="cursor-pointer text-sm font-medium text-gray-700">
                    完了したタスクを表示
                </label>
            </div>

            {/* タスク追加フォーム */}
            <div className="mt-5 space-y-3 rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="text-lg font-bold text-gray-700">新しいタスクの追加</h2>

                <div className="space-y-3">
                    <div>
                        <label htmlFor="todo-name" className="mb-1 block text-sm font-medium text-gray-600">
                            タスク名
                        </label>
                        <input
                            id="todo-name"
                            type="text"
                            value={newTodoName}
                            onChange={(e) => setNewTodoName(e.target.value)}
                            onCompositionStart={() => setIsComposing(true)}
                            onCompositionEnd={() => setIsComposing(false)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !isComposing) {
                                    e.preventDefault();
                                    addNewTodo();
                                }
                            }}
                            placeholder="例: 買い物に行く"
                            className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="todo-priority" className="mb-1 block text-sm font-medium text-gray-600">
                                優先度
                            </label>
                            <select
                                id="todo-priority"
                                value={newTodoPriority}
                                onChange={(e) => setNewTodoPriority(Number(e.target.value) as 1 | 2 | 3)}
                                className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value={1}>高 (1)</option>
                                <option value={2}>中 (2)</option>
                                <option value={3}>低 (3)</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="todo-deadline" className="mb-1 block text-sm font-medium text-gray-600">
                                期限
                            </label>
                            <input
                                id="todo-deadline"
                                type="date"
                                value={newTodoDeadline}
                                onChange={(e) => setNewTodoDeadline(e.target.value)}
                                className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addNewTodo}
                        className="w-full rounded-md bg-indigo-500 px-4 py-2 font-bold text-white transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        追加 (Enter)
                    </button>
                </div>
            </div>

            {/* タスクリスト */}
            <div className="mt-5">
                <TodoList
                    todos={sortedTodos}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                />
            </div>

            {/* 統計情報 */}
            <div className="mt-5 rounded-lg border bg-gray-50 p-3 text-sm text-gray-600">
                <p>
                    全タスク: {todos.length} | 未完了: {uncompletedCount} | 完了: {todos.length - uncompletedCount}
                </p>
            </div>
        </div>
    );
};

export default App;