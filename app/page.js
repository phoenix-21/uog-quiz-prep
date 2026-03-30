"use client";
import { useState, useEffect } from "react";
import QUESTIONS from "../data/questions.json";

const TIME_PER_QUESTION = 15;

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [time, setTime] = useState(TIME_PER_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[current];

  // Timer only runs if quiz started and not on result page
  useEffect(() => {
    if (!started || showResults) return;

    if (time === 0) {
      nextQuestion(null);
      return;
    }

    const timer = setTimeout(() => setTime(prev => prev - 1), 1000);

    return () => clearTimeout(timer);
  }, [time, started, showResults]);

  const nextQuestion = (selected) => {
    setAnswers([...answers, selected]);
    setTime(TIME_PER_QUESTION);

    if (current < total - 1) {
      setCurrent(current + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setStarted(false);
    setCurrent(0);
    setTime(TIME_PER_QUESTION);
    setAnswers([]);
    setShowResults(false);
  };

  const progress = ((TIME_PER_QUESTION - time) / TIME_PER_QUESTION) * 100;

  // ===== START SCREEN =====
  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-10 rounded-2xl shadow-md text-center border fade-in">
          <h1 className="text-2xl font-semibold mb-4 text-slate-800">Academic Quiz</h1>
          <p className="text-slate-500 mb-6">{total} Questions • {TIME_PER_QUESTION}s each</p>
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

  // ===== RESULTS PAGE =====
  if (showResults) {
    const score = answers.reduce((acc, ans, i) => (ans === QUESTIONS[i].answer ? acc + 1 : acc), 0);

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-md border max-w-xl w-full text-center fade-in">
          <h1 className="text-2xl font-semibold mb-4 text-slate-800">Quiz Results</h1>
          <p className="text-slate-700 mb-6 text-lg">
            You scored <span className="font-bold">{score}/{total}</span>
          </p>

          {/* Detailed Results */}
          <div className="space-y-4 text-left max-h-96 overflow-y-auto mb-6">
            {QUESTIONS.map((question, i) => {
              const userAnswer = answers[i];
              const correct = question.answer === userAnswer;
              return (
                <div key={i} className="p-3 border rounded-lg">
                  <p className="font-medium">{i + 1}. {question.question}</p>
                  <p className={`mt-1 ${correct ? "text-green-600" : "text-red-600"}`}>
                    Your answer: {userAnswer || "No answer"} {correct ? "✔" : "✖"}
                  </p>
                  {!correct && <p className="text-green-600">Correct answer: {question.answer}</p>}
                </div>
              );
            })}
          </div>

          <button
            onClick={restartQuiz}
            className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-black transition"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // ===== QUIZ SCREEN =====
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-md border fade-in">

        {/* Header */}
        <div className="flex justify-between items-center mb-3 text-sm text-slate-500">
          <span>Academic Quiz</span>
          <span>{current + 1}/{total}</span>
        </div>

        {/* Timer Bar */}
        <div className="w-full h-2 bg-slate-200 rounded overflow-hidden mb-6">
          <div
            className="h-full bg-slate-800"
            style={{
              width: `${progress}%`,
              transition: "width 1s linear",
              boxShadow: "0 0 6px rgba(0,0,0,0.2)"
            }}
          />
        </div>

        {/* Question */}
        <h2 className="text-lg font-semibold mb-6 text-slate-800 fade-in">
          {q.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {q.options.map((opt, index) => {
            // Highlight correct/wrong after user clicked (optional)
            const answered = answers[current];
            let style = "bg-white text-slate-800";
            if (answered) {
              if (opt === q.answer) style = "bg-green-100 text-green-800 border-green-500";
              else if (opt === answered) style = "bg-red-100 text-red-800 border-red-500";
            }

            return (
              <button
                key={index}
                onClick={() => !answered && nextQuestion(opt)}
                className={`w-full text-left px-4 py-3 border rounded-lg transition ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
