"use client";
import { useState, useEffect } from "react";
import QUESTIONS from "../data/questions.json";

const TIME_PER_QUESTION = 10;

export default function QuizPage() {
  const [started, setStarted] = useState(false); // 🔥 NEW
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);

  const total = QUESTIONS.length;
  const q = QUESTIONS[current];

  // Timer only runs AFTER quiz starts
  useEffect(() => {
    if (!started) return;

    if (time === 0) {
      nextQuestion(null);
      return;
    }

    const timer = setTimeout(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [time, started]);

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

  // 🔴 START SCREEN
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center border fade-in">

          <h1 className="text-2xl font-semibold mb-4 text-slate-800">
            Academic Quiz
          </h1>

          <p className="text-slate-500 mb-6">
            {total} Questions • {TIME_PER_QUESTION}s each
          </p>

          <button
            onClick={() => setStarted(true)}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-black transition"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // 🟢 QUIZ SCREEN
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">

      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border fade-in">

        {/* Header */}
        <div className="flex justify-between text-sm text-slate-500 mb-2">
          <span>Question</span>
          <span>{current + 1}/{total}</span>
        </div>

        {/* Timer */}
        <div className="w-full h-2 bg-slate-200 rounded overflow-hidden mb-6">
          <div
            className="h-full bg-slate-800 transition-all duration-1000 linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-6 text-slate-800">
          {q.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => nextQuestion(opt)}
              className="w-full text-left px-4 py-3 border rounded-lg hover:bg-slate-800 hover:text-white transition"
            >
              {opt}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
