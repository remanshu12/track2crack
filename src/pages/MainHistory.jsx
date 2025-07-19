import React, { useEffect, useState } from "react";
import {
  FaBookReader,
  FaFilter,
  FaChartLine,
  FaSmile,
  FaMeh,
  FaFrown,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainHistory = () => {
  const [history, setHistory] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [dateSort, setDateSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const allSubjects = ["All", "Java", "OOPS", "DSA", "CN", "DBMS", "OS"];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/quiz/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setHistory(data.quizzes || []);
        else toast.error(data.message || "Failed to fetch quiz history.");
      } catch {
        toast.error("Error fetching quiz history.");
      }
    };
    if (token) fetchHistory();
  }, [token]);

  const getPerformanceLevel = (quiz) => {
    const pct = (quiz.score / quiz.totalQuestions) * 100;
    if (pct >= 80) return "Excellent";
    if (pct >= 50) return "Good";
    return "Needs Work";
  };

  const perfIcons = {
    Excellent: <FaSmile className="text-green-500" />,
    Good: <FaMeh className="text-yellow-500" />,
    "Needs Work": <FaFrown className="text-pink-500" />,
  };

  const perfColors = {
    Excellent: "bg-green-100 text-green-800 border-green-200",
    Good: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Needs Work": "bg-pink-100 text-pink-800 border-pink-200",
    All: "bg-white text-gray-700 border-gray-200",
  };

  let results = history.filter((quiz) => {
    const perf = getPerformanceLevel(quiz);
    return (
      (subjectFilter === "All" || quiz.subject === subjectFilter) &&
      (performanceFilter === "All" || perf === performanceFilter) &&
      (searchQuery === "" ||
        quiz.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.topicsCovered?.join(", ").toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  results.sort((a, b) => {
    return dateSort === "newest"
      ? new Date(b.takenAt) - new Date(a.takenAt)
      : new Date(a.takenAt) - new Date(b.takenAt);
  });

  const formatDate = (d) => {
    const dt = new Date(d);
    return isNaN(dt)
      ? "Invalid Date"
      : dt.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const clearFilters = () => {
    setSubjectFilter("All");
    setPerformanceFilter("All");
    setDateSort("newest");
    setSearchQuery("");
  };

  const summary = {
    total: results.length,
    Excellent: results.filter((q) => getPerformanceLevel(q) === "Excellent").length,
    Good: results.filter((q) => getPerformanceLevel(q) === "Good").length,
    "Needs Work": results.filter((q) => getPerformanceLevel(q) === "Needs Work").length,
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <ToastContainer position="top-center" theme="light" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <FaBookReader className="text-5xl text-indigo-400" />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
  My Quiz Journey
</h2>

            <p className="text-sm text-indigo-400">Track your learning progress</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl px-5 py-3 shadow-lg border border-purple-100">
          <div className="flex flex-col items-center">
            <div className="text-xs font-medium text-indigo-400">Showing</div>
            <div className="text-lg font-bold text-indigo-600">
              {results.length}/{history.length}
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
            {perfIcons.Excellent}
            <span className="text-sm font-medium text-green-600">{summary.Excellent}</span>
          </div>
          <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg">
            {perfIcons.Good}
            <span className="text-sm font-medium text-yellow-600">{summary.Good}</span>
          </div>
          <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-lg">
            {perfIcons["Needs Work"]}
            <span className="text-sm font-medium text-pink-600">{summary["Needs Work"]}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-8">
        {/* Top Row - Clear Filter Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 px-4 py-2 rounded-lg border border-pink-200 shadow-sm hover:shadow-md transition"
          >
            <FaTimes /> Clear All Filters
          </button>
        </div>

        {/* Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl shadow-md border border-amber-400">
          <div>
            <label className="block text-xs font-medium text-pink-400 mb-1">Subject</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700"
            >
              {allSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-pink-400 mb-1">Performance</label>
            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700"
            >
              {["All", "Excellent", "Good", "Needs Work"].map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-pink-400 mb-1">Sort By</label>
            <select
              value={dateSort}
              onChange={(e) => setDateSort(e.target.value)}
              className="w-full rounded-lg border border-pink-200 px-3 py-2 shadow-sm hover:shadow-md transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-xs font-medium text-pink-400 mb-1">Search</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search quizzes..."
              className="w-full rounded-lg border border-pink-200 px-3 py-2 pl-10 shadow-sm hover:shadow-md focus:outline-none transition bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700"
            />
            <FaSearch className="absolute left-3 top-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-indigo-300 to-pink-300">
            <tr>
              {["#", "Subject", "Topics", "Score", "Date", "Performance"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left font-semibold text-white"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-50">
            {results.length > 0 ? (
              results.map((quiz, i) => {
                const perf = getPerformanceLevel(quiz);
                const bgHover =
                  perf === "Excellent"
                    ? "hover:bg-green-50"
                    : perf === "Good"
                    ? "hover:bg-yellow-50"
                    : "hover:bg-pink-50";
                return (
                  <tr key={i} className={`${bgHover} transition-all`}>
                    <td className="px-6 py-4 font-medium text-indigo-700">{i + 1}</td>
                    <td className="px-6 py-4 text-blue-500 font-medium">
                      {quiz.subject}
                    </td>
                    <td className="px-6 py-4 text-indigo-600 max-w-xs truncate">
                      {quiz.topicsCovered?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                        {quiz.score}/{quiz.totalQuestions}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-indigo-500">
                      {formatDate(quiz.takenAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${perfColors[perf]}`}
                      >
                        {perfIcons[perf]}
                        {perf}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center px-6 py-16 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <FaChartLine className="text-5xl text-indigo-200" />
                    <p className="text-xl font-semibold text-indigo-500">
                      No quizzes found
                    </p>
                    <p className="text-sm text-indigo-400">
                      Try adjusting filters or take some quizzes
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 hover:from-pink-200 hover:to-purple-200 text-pink-700 px-4 py-2 rounded-lg border border-pink-200 shadow-sm hover:shadow-md transition"
                    >
                      <FaTimes /> Clear All Filters
                    </button>
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

export default MainHistory;