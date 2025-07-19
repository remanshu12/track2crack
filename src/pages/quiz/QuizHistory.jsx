import React, { useEffect, useState } from "react";
//import { FaBookOpen, FaFilter, FaChartLine, FaSmile, FaMeh, FaFrown } from "react-icons/fa";
import { FaBookReader, FaFilter, FaChartLine, FaSmile, FaMeh, FaFrown } from "react-icons/fa";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuizHistory = () => {
  const [history, setHistory] = useState([]);
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [subjectFromQuiz, setSubjectFromQuiz] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/quiz/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          const savedSubject = localStorage.getItem("viewHistoryFor");
          if (savedSubject) setSubjectFromQuiz(savedSubject);
          setHistory(data.quizzes || []);
        } else {
          toast.error(data.message || "Failed to fetch quiz history.");
        }
      } catch (err) {
        toast.error("Error fetching quiz history.");
      }
    };

    fetchHistory();
  }, [token]);

  const getPerformanceLevel = (quiz) => {
    const percentage = (quiz.score / quiz.totalQuestions) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 50) return "Good";
    return "Needs Work";
  };

  const getRowBgColor = (performance) => {
    return {
      Excellent: "hover:bg-green-50",
      Good: "hover:bg-yellow-50",
      "Needs Work": "hover:bg-pink-50",
    }[performance] || "hover:bg-blue-50";
  };

  const filteredHistory = history.filter((item) => {
    const performance = getPerformanceLevel(item);
    const matchPerf = performanceFilter === "All" || performance === performanceFilter;
    const matchSubj = !subjectFromQuiz || item.subject === subjectFromQuiz;
    return matchPerf && matchSubj;
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const summary = {
    total: filteredHistory.length,
    Excellent: filteredHistory.filter((q) => getPerformanceLevel(q) === "Excellent").length,
    Good: filteredHistory.filter((q) => getPerformanceLevel(q) === "Good").length,
    "Needs Work": filteredHistory.filter((q) => getPerformanceLevel(q) === "Needs Work").length,
  };

  const perfColors = {
    Excellent: "bg-green-100 text-green-800 border-green-200",
    Good: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Needs Work": "bg-pink-100 text-pink-800 border-pink-200",
  };

  const perfIcons = {
    Excellent: <FaSmile className="text-green-500" />,
    Good: <FaMeh className="text-yellow-500" />,
    "Needs Work": <FaFrown className="text-pink-500" />,
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <ToastContainer position="top-center" theme="light" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
         <FaBookReader className="text-5xl text-indigo-600" />

          <h2 className="text-2xl font-bold  from-indigo-800-sans">My Quiz Journey</h2>
        </div>

        {/* Summary */}
        <div className="flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-lg border border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Total Attempts:</span>
            <span className="text-lg font-bold text-purple-600">{summary.total}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons.Excellent}
            <span className="text-sm font-medium text-green-600">{summary.Excellent}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons.Good}
            <span className="text-sm font-medium text-yellow-600">{summary.Good}</span>
          </div>
          <div className="flex items-center gap-2">
            {perfIcons["Needs Work"]}
            <span className="text-sm font-medium text-pink-600">{summary["Needs Work"]}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 p-4 bg-white rounded-xl shadow border border-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Filter Performance:</span>
          </div>

          <div className="w-full flex justify-start gap-2 flex-wrap">
            {["All", "Excellent", "Good", "Needs Work"].map((level) => (
              <button
                key={level}
                onClick={() => setPerformanceFilter(level)}
                className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center gap-2
                  ${
                    performanceFilter === level
                      ? perfColors[level] || "bg-purple-100 text-purple-800 border-purple-300 shadow-inner"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-md"
                  }`}
              >
                {level !== "All" && perfIcons[level]}
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-400 to-blue-400">
            <tr>
              {["#", "Subject", "Topics", "Score", "Date", "Performance"].map((head, i) => (
                <th 
                  key={i} 
                  className="px-6 py-4 text-left font-semibold text-white hover:text-purple-100 transition-colors"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => {
                const performance = getPerformanceLevel(item);
                const rowStyle = getRowBgColor(performance);
                return (
                  <tr 
                    key={index} 
                    className={`${rowStyle} transition-all duration-150`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-blue-600 font-medium">{item.subject}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={item.topicsCovered?.join(", ")}>
                      {item.topicsCovered?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {item.score}/{item.totalQuestions}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(item.takenAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${perfColors[performance]}`}>
                        {perfIcons[performance]}
                        {performance}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center px-6 py-16 text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <FaChartLine className="text-5xl text-purple-200" />
                    <p className="text-xl font-semibold text-purple-800">No quizzes found</p>
                    <p className="text-sm text-gray-600">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizHistory;