// src/WelcomeMessage.tsx
type Props = {
    name: string;
    uncompletedCount: number;
};

const WelcomeMessage = ({ name, uncompletedCount }: Props) => {
    return (
        <p className="text-gray-700">
            こんにちは、{name}さん！未完了タスクは {uncompletedCount} 件です。
        </p>
    );
};

export default WelcomeMessage;