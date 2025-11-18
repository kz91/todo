// src/DeleteTodoDialog.tsx
import { useEffect } from "react";
import type { Todo } from "./types";

type Props = {
    todo: Todo;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

const DeleteTodoDialog = ({ todo, isOpen, onClose, onConfirm }: Props) => {
    // Escapeキーでキャンセル
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleBackdropClick}
        >
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        タスクを削除
                    </h2>
                </div>

                <div className="mb-6 space-y-3">
                    <p className="text-gray-700">
                        以下のタスクを削除してもよろしいですか？
                    </p>
                    <div className="rounded-md bg-gray-50 p-3">
                        <p className="font-medium text-gray-800">{todo.name}</p>
                        <p className="mt-1 text-sm text-gray-500">
                            優先度: {todo.priority} | 期限: {todo.deadline.toLocaleDateString()}
                        </p>
                    </div>
                    <p className="text-sm text-red-600">
                        ⚠️ この操作は取り消せません
                    </p>
                </div>

                {/* ボタン */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md bg-gray-400 px-4 py-2 font-bold text-white transition hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-md bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        削除する
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTodoDialog;