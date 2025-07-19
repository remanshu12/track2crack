import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FiBookmark, FiClock, FiAward, FiHelpCircle } from "react-icons/fi";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [bookmarked, setBookmarked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(200); // 20 minutes
  const [timerActive, setTimerActive] = useState(true);
  const [showExplanation, setShowExplanation] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");

  // Load quiz data
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("activeQuiz"));
    if (!saved) {
      toast.error("No quiz found. Redirecting...");
      const fallbackSubject = localStorage.getItem("viewHistoryFor") || "java";
      setTimeout(() => {
        navigate(`/theory/${fallbackSubject.toLowerCase()}`);
      }, 200);
      return;
    }
    setQuizData(saved);
  }, []);

  // Timer logic
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      submitQuiz();
    }
    return () => clearInterval(timer);
  }, [timeLeft, timerActive]);

  const handleAnswer = (index, selectedIdx) => {
    if (submitted) return;
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev, [index]: selectedIdx };
      return newAnswers;
    });
  };

  const toggleBookmark = (index) => {
    setBookmarked((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExplanation = (index) => {
    setShowExplanation((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const submitQuiz = async () => {
    if (!quizData || submitted) return;
    setTimerActive(false);

    // Show all explanations after submission
    const explanationsToShow = {};
    quizData.questions.forEach((q, i) => {
      if (q.explanation) explanationsToShow[i] = true;
    });
    setShowExplanation(explanationsToShow);

    const questions = quizData.questions.map((q, index) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      selectedAnswerIndex: selectedAnswers[index] ?? null,
      topicTag: q.topic,
      difficulty: q.difficulty || 'medium',
      explanation: q.explanation
    }));

    const bookmarkedQuestions = Object.entries(bookmarked)
      .filter(([_, val]) => val)
      .map(([index]) => ({
        questionText: quizData.questions[index].questionText,
        topicTag: quizData.questions[index].topic,
        difficulty: quizData.questions[index].difficulty || 'medium'
      }));

    const correctCount = questions.filter(
      (q) => q.selectedAnswerIndex === q.correctAnswerIndex
    ).length;

    setScore(correctCount);
    setSubmitted(true);

    try {
      const res = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: quizData.subject,
          source: quizData.source,
          topics: quizData.topicsCovered,
          questions,
          bookmarkedQuestions,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Quiz submitted! Score: ${correctCount}/${questions.length}`);
        localStorage.setItem("viewHistoryFor", quizData.subject);
        localStorage.removeItem("activeQuiz");
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      toast.error("Error submitting quiz.");
    }
  };

  if (!quizData) {
    return (
      <div className={`h-screen flex justify-center items-center ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-pink-50"}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400 mb-4"></div>
          <p className={`text-lg ${darkMode ? "text-white" : "text-blue-600"} font-medium`}>Loading quiz...</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(selectedAnswers).length;
  const completionPercentage = Math.round((answeredCount / quizData.questions.length) * 100);

  return (
    <div className={`min-h-screen p-4 md:p-6 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-blue-50 to-pink-50"}`}>
      <ToastContainer position="top-center" theme={darkMode ? "dark" : "light"} />
      
      {/* Header with dark mode toggle */}
      <div className="flex justify-between items-start mb-4">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded-full text-sm ${darkMode ? "bg-gray-700 text-white" : "bg-white text-blue-600 shadow-md"}`}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <FiClock className={`${darkMode ? "text-blue-300" : "text-blue-500"}`} />
            <span className={`font-mono ${timeLeft < 300 ? "text-red-500" : darkMode ? "text-white" : "text-blue-600"}`}>
              {minutes}:{seconds < 10 ? "0" : ""}{seconds}
            </span>
          </div>
          <div className="flex items-center justify-end space-x-2 mt-1">
            <FiAward className={`${darkMode ? "text-yellow-300" : "text-pink-500"}`} />
            <span className={darkMode ? "text-white" : "text-blue-600"}>
              {submitted ? `${score}/${quizData.questions.length}` : "--"}
            </span>
          </div>
        </div>
      </div>

      {/* Main quiz header */}
      <div className={`rounded-2xl p-6 mb-8 ${darkMode ? "bg-gray-800" : "bg-gradient-to-r from-indigo-400 to-blue-400"} text-white shadow-xl`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {quizData.subject} Quiz ({quizData.source})
            </h2>
            <p className={`${darkMode ? "text-blue-200" : "text-blue-50"}`}>
              Topics: {quizData.topicsCovered.join(", ")}
            </p>
          </div>
          <div className="w-24 h-24 mt-4 md:mt-0">
            <CircularProgressbar
              value={completionPercentage}
              text={`${completionPercentage}%`}
              styles={buildStyles({
                textColor: "#ffffff",
                pathColor: timeLeft > 300 
                  ? (darkMode ? "#93c5fd" : "#93c5fd")
                  : "#6366F1",
                trailColor: darkMode 
                  ? "rgba(255,255,255,0.1)" 
                  : "rgba(255,255,255,0.2)",
                textSize: "32px",
              })}
            />
          </div>
        </div>
      </div>

      {/* Show All Explanations button */}
      {!submitted && (
        <div className="text-center mb-6">
          <button
            onClick={() => {
              const explanations = {};
              quizData.questions.forEach((q, i) => {
                if (q.explanation) explanations[i] = true;
              });
              setShowExplanation(explanations);
            }}
            className={`px-4 py-2 rounded-lg ${
              darkMode 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Show All Explanations
          </button>
        </div>
      )}

      {/* Progress indicators */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-blue-500"}`}>
            Questions answered: {answeredCount}/{quizData.questions.length}
          </span>
          <span className={`text-sm font-medium ${darkMode ? "text-blue-300" : "text-pink-500"}`}>
            {completionPercentage}% complete
          </span>
        </div>
        <div className={`w-full rounded-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
          <div 
            className={`h-2.5 rounded-full ${darkMode ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-blue-400 to-pink-400"}`} 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {quizData.questions.map((q, index) => {
          const selected = selectedAnswers[index];
          const isCorrect = selected === q.correctAnswerIndex;
          const isBookmarked = bookmarked[index];
          const explanationVisible = showExplanation[index];
          const difficulty = q.difficulty || 'medium';

          return (
            <div
              key={index}
              className={`p-6 rounded-xl border-2 transition-all ${
                submitted
                  ? isCorrect
                    ? darkMode 
                      ? "border-emerald-500 bg-gray-800 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]" 
                      : "border-blue-300 bg-gradient-to-br from-blue-50 to-pink-50 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
                    : darkMode
                      ? "border-rose-500 bg-gray-800 hover:shadow-[0_5px_15px_rgba(244,63,94,0.3)]"
                      : "border-pink-300 bg-gradient-to-br from-pink-50 to-blue-50 hover:shadow-[0_5px_15px_rgba(244,114,182,0.3)]"
                  : darkMode
                    ? "border-gray-700 bg-gray-800 hover:border-gray-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                    : "border-blue-100 bg-white hover:border-pink-200 hover:shadow-[0_5px_15px_rgba(219,234,254,0.3)]"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                    submitted
                      ? isCorrect
                        ? darkMode
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-400 text-white"
                        : darkMode
                          ? "bg-rose-600 text-white"
                          : "bg-pink-400 text-white"
                      : darkMode
                        ? "bg-gray-700 text-white"
                        : "bg-blue-100 text-blue-600"
                  } font-bold`}>
                    {index + 1}
                  </span>
                  <div>
                    <h3 className={`font-medium text-lg ${darkMode ? "text-white" : "text-blue-800"}`}>
                      {q.questionText}
                    </h3>
                    <span className={`text-sm font-medium ${
                      difficulty === 'easy' 
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : difficulty === 'hard'
                          ? darkMode ? 'text-red-400' : 'text-red-600'
                          : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <button 
                    onClick={() => toggleBookmark(index)}
                    className={`text-xl transition-colors ${isBookmarked ? "text-pink-400" : darkMode ? "text-gray-400 hover:text-pink-400" : "text-blue-300 hover:text-pink-400"}`}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                  >
                    {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  </button>
                  {q.explanation && !submitted && !showExplanation[index] && (
                    <span className={`text-xs ${darkMode ? "text-blue-300" : "text-blue-500"}`}>
                      (Has explanation)
                    </span>
                  )}
                  {q.explanation && (
                    <button
                      onClick={() => toggleExplanation(index)}
                      className={`text-xl ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-600"}`}
                      aria-label={explanationVisible ? "Hide explanation" : "Show explanation"}
                    >
                      <FiHelpCircle />
                    </button>
                  )}
                </div>
              </div>

              {q.explanation && (submitted || showExplanation[index]) && (
                <div className={`ml-11 mb-4 p-3 rounded-lg ${darkMode ? "bg-gray-700 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                  <p className="font-medium">Explanation:</p>
                  <p className="mt-1">{q.explanation}</p>
                </div>
              )}

              <ul className="mt-4 space-y-3 ml-11">
                {q.options.map((opt, idx) => {
                  const isSelected = selected === idx;
                  const isCorrectAnswer = q.correctAnswerIndex === idx;
                  let optionClasses = "p-3 border rounded-lg flex items-center";

                  if (submitted) {
                    if (isSelected) {
                      optionClasses += isCorrectAnswer
                        ? darkMode
                          ? " bg-emerald-900/50 border-emerald-500 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                          : " bg-blue-100 border-blue-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
                        : darkMode
                          ? " bg-rose-900/50 border-rose-500 hover:shadow-[0_5px_15px_rgba(244,63,94,0.3)]"
                          : " bg-pink-100 border-pink-300 hover:shadow-[0_5px_15px_rgba(249,168,212,0.3)]";
                    } else if (isCorrectAnswer) {
                      optionClasses += darkMode
                        ? " bg-emerald-900/30 border-emerald-400 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                        : " bg-blue-50 border-blue-200 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]";
                    } else {
                      optionClasses += darkMode
                        ? " bg-gray-700 border-gray-600 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                        : " bg-white border-blue-100 hover:shadow-[0_5px_15px_rgba(219,234,254,0.1)]";
                    }
                  } else if (isSelected) {
                    optionClasses += darkMode
                      ? " bg-blue-900/30 border-blue-500 hover:shadow-[0_5px_15px_rgba(59,130,246,0.3)]"
                      : " bg-blue-100 border-blue-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]";
                  } else {
                    optionClasses += darkMode
                      ? " bg-gray-700 border-gray-600 hover:border-gray-500 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                      : " bg-white border-blue-100 hover:border-pink-200 hover:shadow-[0_5px_15px_rgba(219,234,254,0.1)]";
                  }

                  return (
                    <li
                      key={idx}
                      onClick={() => handleAnswer(index, idx)}
                      className={`${optionClasses} cursor-pointer transition-all`}
                    >
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                        submitted
                          ? isCorrectAnswer
                            ? darkMode
                              ? "bg-emerald-500 text-white"
                              : "bg-blue-400 text-white"
                            : isSelected
                              ? darkMode
                                ? "bg-rose-500 text-white"
                                : "bg-pink-400 text-white"
                              : darkMode
                                ? "bg-gray-600 text-gray-300"
                                : "bg-blue-100 text-blue-600"
                          : isSelected
                            ? darkMode
                              ? "bg-blue-500 text-white"
                              : "bg-blue-400 text-white"
                            : darkMode
                              ? "bg-gray-600 text-gray-300"
                              : "bg-blue-100 text-blue-600"
                      } font-medium text-sm`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={darkMode ? "text-gray-100" : "text-blue-800"}>{opt}</span>
                    </li>
                  );
                })}
              </ul>

              {submitted && selected !== q.correctAnswerIndex && (
                <div className={`mt-4 ml-11 p-3 rounded-lg ${darkMode ? "bg-rose-900/30 border-rose-700" : "bg-pink-50 border-pink-200"}`}>
                  <p className={`font-medium ${darkMode ? "text-rose-300" : "text-pink-700"}`}>
                    ❌ Your answer was incorrect.
                  </p>
                  <p className={`mt-1 ${darkMode ? "text-rose-200" : "text-pink-800"}`}>
                    <span className="font-semibold">Correct answer:</span> {q.options[q.correctAnswerIndex]}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit section */}
      <div className="mt-10 text-center mb-16">
        {!submitted ? (
          <button
            onClick={submitQuiz}
            disabled={Object.keys(selectedAnswers).length === 0}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transition-all ${
              Object.keys(selectedAnswers).length === 0
                ? darkMode
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-400 cursor-not-allowed"
                : darkMode
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-[0_5px_15px_rgba(79,70,229,0.3)]"
                  : "bg-gradient-to-r from-blue-400 to-pink-400 text-white hover:from-blue-500 hover:to-pink-500 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
            } transform hover:-translate-y-0.5`}
          >
            Submit Quiz
          </button>
        ) : (
          <div className="space-y-6">
            <div
              className={`p-6 rounded-2xl shadow-xl max-w-md mx-auto ${
                darkMode
                  ? "bg-gradient-to-r from-emerald-700 to-teal-800 hover:shadow-[0_5px_15px_rgba(16,185,129,0.3)]"
                  : "bg-gradient-to-r from-blue-300 to-pink-300 hover:shadow-[0_5px_15px_rgba(147,197,253,0.3)]"
              } text-white`}
            >
              <h3 className="text-2xl font-bold mb-2">Quiz Completed! 🎉</h3>
              <div className="text-4xl font-extrabold mb-3">
                {score}/{quizData.questions.length}
              </div>
              <div className="text-lg mb-4">
                {score === quizData.questions.length
                  ? "Perfect score! You're amazing!"
                  : score >= quizData.questions.length * 0.8
                  ? "Excellent work!"
                  : score >= quizData.questions.length * 0.6
                  ? "Good job!"
                  : "Keep practicing!"}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div
                  className="bg-white h-2 rounded-full"
                  style={{
                    width: `${(score / quizData.questions.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating View History button */}
      {submitted && (
        <Link
          to="/quiz/history"
          onClick={() => localStorage.setItem("viewHistoryFor", quizData.subject)}
          className={`sticky bottom-4 ml-125 px-6 py-3 rounded-lg font-semibold text-lg z-50 shadow-xl transition-all transform hover:-translate-y-0.5 ${
            darkMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          View All Quiz History
        </Link>
      )}
    </div>
  );
};

export default Quiz;