// src/EditTodoDialog.tsx
import { useState, useEffect } from "react";
import type { Todo } from "./types";

type Props = {
    todo: Todo;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Todo>) => void;
};

const EditTodoDialog = ({ todo, isOpen, onClose, onSave }: Props) => {
    const [name, setName] = useState(todo.name);
    const [priority, setPriority] = useState<1 | 2 | 3>(todo.priority);
    const [deadline, setDeadline] = useState(
        todo.deadline.toISOString().split("T")[0]
    );
    const [isComposing, setIsComposing] = useState(false); // IME変換中かどうか

    // todoが変更されたら状態を更新
    useEffect(() => {
        setName(todo.name);
        setPriority(todo.priority);
        setDeadline(todo.deadline.toISOString().split("T")[0]);
    }, [todo]);

    // Escapeキーでキャンセル、Enterキーで保存
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Escapeキーでキャンセル
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }

            // Enterキーで保存（IME変換中、Shift+Enter、input以外の要素でのEnterは除外）
            if (e.key === "Enter") {
                // IME変換中はスキップ
                if (e.isComposing) {
                    return;
                }

                // Shift+Enterは改行なのでスキップ（テキストエリアがある場合用）
                if (e.shiftKey) {
                    return;
                }

                e.preventDefault();
                handleSave();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, name, priority, deadline, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) {
            alert("タスク名を入力してください");
            return;
        }

        onSave(todo.id, {
            name: name.trim(),
            priority,
            deadline: new Date(deadline),
        });
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-bold text-gray-800">
                    タスクを編集
                </h2>
                <p className="mb-4 text-sm text-gray-500">
                    💡 ヒント: Enterで保存 / Escでキャンセル
                </p>

                <div className="space-y-4">
                    {/* タスク名 */}
                    <div>
                        <label
                            htmlFor="edit-name"
                            className="mb-1 block text-sm font-medium text-gray-600"
                        >
                            タスク名
                        </label>
                        <input
                            id="edit-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>

                    {/* 優先度 */}
                    <div>
                        <label
                            htmlFor="edit-priority"
                            className="mb-1 block text-sm font-medium text-gray-600"
                        >
                            優先度
                        </label>
                        <select
                            id="edit-priority"
                            value={priority}
                            onChange={(e) =>
                                setPriority(Number(e.target.value) as 1 | 2 | 3)
                            }
                            className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value={1}>高 (1)</option>
                            <option value={2}>中 (2)</option>
                            <option value={3}>低 (3)</option>
                        </select>
                    </div>

                    {/* 期限 */}
                    <div>
                        <label
                            htmlFor="edit-deadline"
                            className="mb-1 block text-sm font-medium text-gray-600"
                        >
                            期限
                        </label>
                        <input
                            id="edit-deadline"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full rounded-md border px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* ボタン */}
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={handleSave}
                        className="flex-1 rounded-md bg-indigo-500 px-4 py-2 font-bold text-white transition hover:bg-indigo-600"
                    >
                        保存
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md bg-gray-400 px-4 py-2 font-bold text-white transition hover:bg-gray-500"
                    >
                        キャンセル
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTodoDialog;