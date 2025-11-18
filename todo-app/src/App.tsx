// src/App.tsx
import { useState, useEffect } from "react";
import type { Todo } from "./types";
import TodoList from "./TodoList";
import WelcomeMessage from "./WelcomeMessage";
import { v4 as uuid } from "uuid";

const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodoName, setNewTodoName] = useState("");
    const [newTodoPriority, setNewTodoPriority] = useState<1 | 2 | 3>(3);
    const [newTodoDeadline, setNewTodoDeadline] = useState("");
    const [showCompleted, setShowCompleted] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isComposing, setIsComposing] = useState(false); // IME変換中かどうか

    // Supabaseからデータを取得
    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .eq('user_id', user?.id)
                .order('priority', { ascending: true });

            if (error) throw error;

            const transformedTodos: Todo[] = (data as DbTodo[]).map((dbTodo) => ({
                id: dbTodo.id,
                name: dbTodo.name,
                isDone: dbTodo.is_done,
                priority: dbTodo.priority as 1 | 2 | 3,
                deadline: new Date(dbTodo.deadline),
            }));

            setTodos(transformedTodos);
        } catch (error) {
            console.error('Todoの取得に失敗しました:', error);
            alert('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };

    const addNewTodo = async () => {
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

        try {
            const { error } = await supabase
                .from('todos')
                .insert({
                    id: newTodo.id,
                    user_id: user?.id,
                    name: newTodo.name,
                    is_done: newTodo.isDone,
                    priority: newTodo.priority,
                    deadline: newTodo.deadline.toISOString(),
                });

            if (error) throw error;

            setTodos([...todos, newTodo]);
            setNewTodoName("");
            setNewTodoPriority(3);
            setNewTodoDeadline("");
        } catch (error) {
            console.error('Todoの追加に失敗しました:', error);
            alert('タスクの追加に失敗しました');
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;

        const newIsDone = !todo.isDone;

        try {
            const { error } = await supabase
                .from('todos')
                .update({ is_done: newIsDone })
                .eq('id', id);

            if (error) throw error;

            setTodos(
                todos.map((t) =>
                    t.id === id ? { ...t, isDone: newIsDone } : t
                )
            );
        } catch (error) {
            console.error('Todoの更新に失敗しました:', error);
            alert('タスクの更新に失敗しました');
        }
    };

    const deleteTodo = async (id: string) => {
        if (!confirm("このタスクを削除しますか？")) return;

        try {
            const { error } = await supabase
                .from('todos')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setTodos(todos.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Todoの削除に失敗しました:', error);
            alert('タスクの削除に失敗しました');
        }
    };

    const updateTodo = async (id: string, updates: Partial<Todo>) => {
        try {
            const dbUpdates: Partial<DbTodo> = {};
            if (updates.name) dbUpdates.name = updates.name;
            if (updates.isDone !== undefined) dbUpdates.is_done = updates.isDone;
            if (updates.priority) dbUpdates.priority = updates.priority;
            if (updates.deadline) dbUpdates.deadline = updates.deadline.toISOString();

            const { error } = await supabase
                .from('todos')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;

            setTodos(
                todos.map((t) =>
                    t.id === id ? { ...t, ...updates } : t
                )
            );
        } catch (error) {
            console.error('Todoの更新に失敗しました:', error);
            alert('タスクの更新に失敗しました');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('ログアウトに失敗しました:', error);
        }
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

    const uncompletedCount = todos.filter((todo) => !todo.isDone).length;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl text-gray-600">読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
            {/* ヘッダー */}
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">TodoApp</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{user?.email}</span>
                    <button
                        onClick={handleSignOut}
                        className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white transition hover:bg-gray-600"
                    >
                        ログアウト
                    </button>
                </div>
            </div>

            <WelcomeMessage name={user?.email?.split('@')[0] || "ユーザー"} uncompletedCount={uncompletedCount} />

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
                            onKeyDown={(e) => {
                                // IME変換中かどうかをチェック
                                if (e.key === "Enter") {
                                    // isComposingがtrueの場合は変換中なので処理しない
                                    if (e.nativeEvent.isComposing) {
                                        return;
                                    }
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
                        追加
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