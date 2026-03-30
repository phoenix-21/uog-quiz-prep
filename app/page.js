"use client";
import { useState, useEffect } from "react";
import QUESTIONS from "../data/questions.json";

const TIME_PER_QUESTION = 10;

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);

  const total = QUESTIONS.length;
  const q = QUESTIONS[current];

  useEffect(() => {
    if (time === 0) {
      nextQuestion(null);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  const nextQuestion = (selected) => {
    setAnswers([...answers, selected]);
    setTime(TIME_PER_QUESTION);

    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      finishQuiz([...answers, selected]);
    }
  };

  const finishQuiz = (finalAnswers) => {
    let score = 0;

    finalAnswers.forEach((ans, i) => {
      if (ans === QUESTIONS[i].answer) score++;
    });

    alert(`Quiz Finished!\nScore: ${score}/${total}`);
  };

  const progress = ((TIME_PER_QUESTION - time) / TIME_PER_QUESTION) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border fade-in">

        {/* Header */}
        <div className="flex justify-between items-center mb-3 text-sm text-slate-500">
          <span className="font-medium tracking-wide">Academic Quiz</span>
          <span className="font-semibold">{current + 1}/{total}</span>
        </div>

        {/* Timer */}
        <div className="w-full h-2 bg-slate-200 rounded overflow-hidden mb-6">
          <div
            className="h-full bg-slate-800 timer-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-6 text-slate-800 fade-in">
          {q.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => nextQuestion(opt)}
              className="option-btn w-full text-left px-4 py-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-800 hover:text-white"
            >
              {opt}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
