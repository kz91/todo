// src/todoStorage.ts
import type { Todo } from "./types";

const STORAGE_KEY = "todos";

// LocalStorageからTodoを取得
export const loadTodos = (): Todo[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        // 日付をDateオブジェクトに変換
        return parsed.map((todo: any) => ({
            ...todo,
            deadline: new Date(todo.deadline),
        }));
    } catch (error) {
        console.error("Todoの読み込みに失敗しました:", error);
        return [];
    }
};

// LocalStorageにTodoを保存
export const saveTodos = (todos: Todo[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error("Todoの保存に失敗しました:", error);
        alert("データの保存に失敗しました");
    }
};

// LocalStorageをクリア
export const clearTodos = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Todoのクリアに失敗しました:", error);
    }
};