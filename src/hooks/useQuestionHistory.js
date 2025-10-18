import { useState } from 'react';

export const useQuestionHistory = () => {
    const [questionHistory] = useState(new Map());

    const updateHistory = (theme, question) => {
        if (!question) return;
        const history = questionHistory.get(theme) || [];
        questionHistory.set(theme, [...history, question.substring(0, 200)]);
    };

    const getHistory = (theme) => {
        return questionHistory.get(theme) || [];
    };

    return [questionHistory, updateHistory, getHistory];
};