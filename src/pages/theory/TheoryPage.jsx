import React, { useEffect, useState, useRef } from "react";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TheoryPage = ({ subject, title }) => {
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState({});
  const [activeTopic, setActiveTopic] = useState(null);
  const [userKnowsTopic, setUserKnowsTopic] = useState(null);
  const [showResources, setShowResources] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({});
  const [openNoteId, setOpenNoteId] = useState(null);
  const [noteText, setNoteText] = useState("");
  const noteRefs = useRef({});
  const [activeFilters, setActiveFilters] = useState({
    All: true,
    Important: false,
    Other: false,
    Bookmarked: false,
    Remind: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split(".")[1]))?.userId;

  useEffect(() => {
    const fetchData = async () => {
      const [topicsRes, progressRes] = await Promise.all([
        fetch(`http://localhost:5000/api/theory/topics?subject=${subject}`),
        fetch(`http://localhost:5000/api/theory/progress/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const topicsData = await topicsRes.json();
      const progressData = await progressRes.json();
      const progressMap = {};

      (progressData?.progress || []).forEach((p) => {
        progressMap[p.topicId] = {
          isCompleted: p.isCompleted,
          isBookmarked: p.isBookmarked,
          remindOn: p.remindOn,
          note: p.note || "",
          quizTaken: p.quizTaken || false,
          quizScore: p.quizScore || 0
        };
      });

      setTopics(topicsData.topics || []);
      setProgress(progressMap);
      
      // Find the first incomplete topic to set as active
      const firstIncomplete = topicsData.topics?.find(t => !progressMap[t._id]?.isCompleted);
      setActiveTopic(firstIncomplete?._id || null);
    };

    if (token && userId) fetchData();
  }, [token, userId, subject]);

  useEffect(() => {
    const handleQuizCompletion = async () => {
      const quizData = localStorage.getItem('quizCompleted');
      if (quizData) {
        const { topicId, score } = JSON.parse(quizData);
        
        // Update progress for the quiz that was just completed
        const updatedProgress = {
          ...progress,
          [topicId]: {
            ...progress[topicId] || {},
            quizTaken: true,
            quizScore: score
          }
        };
        
        setProgress(updatedProgress);
        toast.success(`Quiz completed! Score: ${score}%`);
        localStorage.removeItem('quizCompleted');

        // Save to backend
        await fetch("http://localhost:5000/api/theory/progress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topicId,
            isCompleted: updatedProgress[topicId]?.isCompleted || false,
            isBookmarked: updatedProgress[topicId]?.isBookmarked || false,
            remindOn: updatedProgress[topicId]?.remindOn || null,
            note: updatedProgress[topicId]?.note || "",
            quizTaken: true,
            quizScore: score
          }),
        });

        // If this was the active topic, move to next topic if not completed
        if (topicId === activeTopic) {
          const nextTopic = topics.find(t => !updatedProgress[t._id]?.isCompleted && t._id !== topicId);
          setActiveTopic(nextTopic?._id || null);
          setUserKnowsTopic(null);
          setShowResources(false);
          setShowQuiz(false);
        }
      }
    };

    if (token && userId) handleQuizCompletion();
  }, [activeTopic, progress, topics, token, userId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openNoteId && noteRefs.current[openNoteId] && !noteRefs.current[openNoteId].contains(e.target)) {
        setOpenNoteId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openNoteId]);

  const completed = Object.values(progress).filter((p) => p?.isCompleted).length;
  const bookmarked = Object.values(progress).filter((p) => p?.isBookmarked).length;
  const total = topics.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const toggleFilter = (filterName) => {
    if (["All", "Important", "Other"].includes(filterName)) {
      const newFilters = {
        All: false,
        Important: false,
        Other: false,
        Bookmarked: activeFilters.Bookmarked,
        Remind: activeFilters.Remind,
      };
      newFilters[filterName] = true;
      setActiveFilters(newFilters);
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        [filterName]: !prev[filterName],
        All: prev.All && !["Important", "Other"].some((f) => prev[f]),
        Important: prev.Important && filterName !== "All",
        Other: prev.Other && filterName !== "All",
      }));
    }
  };

  const updateProgress = async (topicId, field, value = null) => {
    const prev = progress[topicId] || {};
    const updated = {
      ...prev,
      [field]: field === "remindOn" || field === "quizScore" ? value : field === "note" ? value : !prev?.[field],
    };
    
    const newProgress = { ...progress, [topicId]: updated };
    setProgress(newProgress);

    await fetch("http://localhost:5000/api/theory/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topicId,
        isCompleted: updated.isCompleted,
        isBookmarked: updated.isBookmarked,
        remindOn: updated.remindOn ?? null,
        note: updated.note ?? "",
        quizTaken: updated.quizTaken || false,
        quizScore: updated.quizScore || 0
      }),
    });

    // If marking as complete, move to next topic
    if (field === 'isCompleted' && value === true) {
      const nextTopic = topics.find(t => !newProgress[t._id]?.isCompleted && t._id !== topicId);
      setActiveTopic(nextTopic?._id || null);
      setUserKnowsTopic(null);
      setShowResources(false);
      setShowQuiz(false);
    }
  };

  const handleSingleTopicQuiz = async (topicTitle) => {
    try {
      const response = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject: subject,
          topics: [topicTitle],
          source: "Theory",
        }),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message || "Failed to generate quiz");

      // Store current topic ID before redirecting
      localStorage.setItem('activeQuiz', JSON.stringify({
        ...data,
        topicId: activeTopic
      }));
      window.location.href = "/quiz";
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Something went wrong while generating the quiz");
    }
  };

  const getIconUrl = (type, url) => {
    if (type === "video") return "https://img.icons8.com/color/32/youtube-play.png";
    if (url.includes("geeksforgeeks")) return "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg";
    return "https://img.icons8.com/ios-filled/32/000000/read.png";
  };

  const handleUserResponse = (knowsTopic) => {
    setUserKnowsTopic(knowsTopic);
    if (knowsTopic) {
      setShowQuiz(true);
    } else {
      setShowResources(true);
    }
  };

  const completeTopic = () => {
    updateProgress(activeTopic, "isCompleted", true);
  };

  const filteredTopics = topics.filter((t) => {
    const matchTypeFilter =
      activeFilters.All ||
      (activeFilters.Important && t.type === "Important") ||
      (activeFilters.Other && t.type === "Other");
    const matchBookmarked = !activeFilters.Bookmarked || progress[t._id]?.isBookmarked;
    const matchRemind = !activeFilters.Remind || progress[t._id]?.remindOn;
    const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchTypeFilter && matchBookmarked && matchRemind && matchSearch;
  });

  const currentTopic = topics.find(t => t._id === activeTopic);
  const topicProgress = activeTopic ? progress[activeTopic] || {} : {};

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto text-sm bg-gray-50 min-h-screen">
      <ToastContainer />
      
      {/* Dashboard */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-800 mb-6">{title} Learning Path</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 text-center">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 md:p-4 rounded-lg border border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-xl md:text-2xl font-bold text-indigo-700">{total}</div>
          <div className="text-xs md:text-sm text-indigo-600 font-medium">Total Topics</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 md:p-4 rounded-lg border border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-xl md:text-2xl font-bold text-green-700">{completed}</div>
          <div className="text-xs md:text-sm text-green-600 font-medium">Completed</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 md:p-4 rounded-lg border border-amber-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="text-xl md:text-2xl font-bold text-amber-700">{bookmarked}</div>
          <div className="text-xs md:text-sm text-amber-600 font-medium">Bookmarked</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 md:p-4 rounded-lg border border-orange-200 shadow-md hover:shadow-lg transition-shadow flex flex-col justify-center items-center">
          <div style={{ width: 50, height: 50 }} className="md:w-15 md:h-15">
            <CircularProgressbarWithChildren 
              value={percent} 
              styles={buildStyles({ 
                pathColor: "#ea580c",
                trailColor: "#fed7aa"
              })}
            >
              <div className="text-sm md:text-lg font-semibold text-orange-800">{percent}%</div>
            </CircularProgressbarWithChildren>
          </div>
          <div className="text-xs mt-1 font-semibold text-orange-700">Progress</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="flex flex-wrap gap-2">
          {["All", "Important", "Other", "Bookmarked", "Remind"].map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1 text-xs md:text-sm md:px-4 md:py-1.5 rounded-lg border transition-all shadow-md hover:shadow-lg ${
                activeFilters[type]
                  ? type === "Important"
                    ? "bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700"
                    : type === "Other"
                    ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                    : type === "Bookmarked"
                    ? "bg-violet-600 text-white border-violet-700 hover:bg-violet-700"
                    : type === "Remind"
                    ? "bg-sky-500 text-white border-sky-600 hover:bg-sky-600"
                    : "bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1.5 md:py-2 rounded border border-gray-300 shadow-sm w-full md:w-48 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs md:text-sm"
        />
      </div>

      {/* Current Active Topic */}
      {currentTopic && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border-2 border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-4">
            Current Topic: {currentTopic.title}
          </h3>
          
          {userKnowsTopic === null && !topicProgress.quizTaken && (
            <div className="mb-6">
              <p className="text-gray-700 mb-4">Do you already know this topic?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleUserResponse(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Yes, I know it
                </button>
                <button 
                  onClick={() => handleUserResponse(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  No, I need to learn
                </button>
              </div>
            </div>
          )}

          {showResources && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Learning Resources:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTopic.resources?.map((resource, idx) => (
                  <a 
                    key={idx}
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img 
                      src={getIconUrl(resource.type, resource.url)} 
                      alt={resource.type} 
                      className="w-8 h-8 mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">{resource.title || resource.type}</p>
                      <p className="text-xs text-gray-500">{new URL(resource.url).hostname}</p>
                    </div>
                  </a>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowQuiz(true);
                  setShowResources(false);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                I've reviewed the resources, test me now
              </button>
            </div>
          )}

          {showQuiz && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Test Your Knowledge:</h4>
              <p className="text-gray-700 mb-4">
                Take a short quiz on this topic to assess your understanding.
              </p>
              <button
                onClick={() => handleSingleTopicQuiz(currentTopic.title)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Quiz
              </button>
              {topicProgress.quizTaken && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    Quiz score: {topicProgress.quizScore}%
                    {topicProgress.quizScore >= 70 ? " - Great job!" : " - Keep practicing!"}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={!!topicProgress.isBookmarked}
                  onChange={() => updateProgress(currentTopic._id, "isBookmarked")}
                  className="w-5 h-5 accent-amber-500 mr-2"
                  id={`bookmark-${currentTopic._id}`}
                />
                <label htmlFor={`bookmark-${currentTopic._id}`} className="text-gray-700">
                  Bookmark
                </label>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowDatePicker((prev) => ({ ...prev, [currentTopic._id]: !prev[currentTopic._id] }))} 
                  className={`flex items-center gap-1 ${topicProgress.remindOn ? "text-sky-600" : "text-gray-500"}`}
                >
                  <span>{topicProgress.remindOn ? "⏰" : "🕒"}</span>
                  <span>{topicProgress.remindOn ? "Change Reminder" : "Set Reminder"}</span>
                </button>
                {showDatePicker[currentTopic._id] && (
                  <input
                    type="date"
                    value={topicProgress.remindOn ? topicProgress.remindOn.split("T")[0] : ""}
                    onChange={(e) => updateProgress(currentTopic._id, "remindOn", e.target.value)}
                    className="absolute top-8 left-0 px-1.5 py-1 border border-gray-300 rounded text-xs bg-white z-10 shadow-md"
                    onBlur={() => setShowDatePicker((prev) => ({ ...prev, [currentTopic._id]: false }))}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setOpenNoteId(currentTopic._id);
                  setNoteText(topicProgress.note || "");
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <span className="mr-1">📝</span>
                {topicProgress.note ? "Edit Notes" : "Add Notes"}
              </button>

              {topicProgress.quizTaken && (
                <button
                  onClick={completeTopic}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark as Complete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Topics List */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Topics</h3>
        <div className="hidden md:grid md:grid-cols-[60px_2fr_70px_70px_90px_90px_100px_120px] font-semibold text-gray-600 border-b-2 border-gray-200 pb-3 mb-3">
          <div className="text-center">Status</div>
          <div className="pl-2">Topic</div>
          <div className="text-left">GFG</div>
          <div className="text-left">YT</div>
          <div className="text-left pl-4">Quiz</div>
          <div className="text-left pl-1">Bookmark</div>
          <div className="text-left pl-1">Reminder</div>
          <div className="text-left">Notes</div>
        </div>

        {filteredTopics.map((topic) => {
          const { isCompleted, isBookmarked, remindOn, note, quizTaken } = progress[topic._id] || {};
          const gfg = topic.resources?.find((r) => r.url.includes("geeksforgeeks"));
          const yt = topic.resources?.find((r) => r.type === "video");

          return (
            <div
              key={topic._id}
              className={`grid grid-cols-1 md:grid-cols-[60px_2fr_70px_70px_90px_90px_100px_120px] gap-2 md:gap-0 p-3 mb-3 rounded-xl transition-all ${
                isCompleted 
                  ? "bg-green-50 border-2 border-green-400 hover:border-green-500" 
                  : topic._id === activeTopic
                  ? "bg-indigo-50 border-2 border-indigo-400"
                  : "bg-white border border-gray-200 hover:border-gray-300"
              } hover:shadow-md`}
            >
              {/* Mobile View */}
              <div className="flex justify-between items-center md:hidden">
                <div className={`font-semibold text-sm ${
                  isCompleted ? "text-green-800" : 
                  topic._id === activeTopic ? "text-indigo-800" : "text-gray-800"
                }`}>
                  {topic.title}
                </div>
                {isCompleted ? (
                  <span className="text-green-600">✓</span>
                ) : (
                  <span className="text-gray-400">○</span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 md:hidden">
                <div className="flex justify-center">
                  {gfg ? (
                    <a href={gfg.url} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                      <img src={getIconUrl("article", gfg.url)} className="w-5 h-5" alt="GFG" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {yt ? (
                    <a href={yt.url} target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                      <img src={getIconUrl("video", yt.url)} className="w-5 h-5" alt="YouTube" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {topic.type === "Important" ? (
                    <button 
                      onClick={() => handleSingleTopicQuiz(topic.title)} 
                      disabled={topic._id !== activeTopic}
                      className={`px-1 py-0.5 text-xs rounded border transition-all ${
                        topic._id === activeTopic 
                          ? "bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 border-purple-200"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      Quiz
                    </button>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </div>
                <div className="flex justify-center">
                  <button 
                    onClick={() => updateProgress(topic._id, "isBookmarked")}
                    className="text-xl hover:scale-110 transition-transform"
                    aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    {isBookmarked ? (
                      <span className="text-amber-500">🔖</span>
                    ) : (
                      <span className="text-gray-400">📑</span>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center md:hidden">
                <div className="relative">
                  <button 
                    onClick={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: !prev[topic._id] }))} 
                    className={`text-xl hover:scale-110 transition-transform ${
                      remindOn ? "text-sky-500" : "text-gray-400"
                    }`}
                    aria-label={remindOn ? "Change reminder" : "Set reminder"}
                  >
                    {remindOn ? "⏰" : "🕒"}
                  </button>
                  {showDatePicker[topic._id] && (
                    <input
                      type="date"
                      value={remindOn ? remindOn.split("T")[0] : ""}
                      onChange={(e) => updateProgress(topic._id, "remindOn", e.target.value)}
                      className="absolute top-8 left-0 px-1.5 py-1 border border-gray-300 rounded text-xs bg-white z-10 shadow-md"
                      onBlur={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: false }))}
                    />
                  )}
                </div>
                <div ref={(el) => (noteRefs.current[topic._id] = el)} className="relative">
                  {note ? (
                    <div className="flex gap-1 items-center text-xs font-semibold">
                      <span className="text-amber-500">📄</span>
                      <button 
                        onClick={() => { setOpenNoteId(topic._id); setNoteText(note); }}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Edit note"
                      >
                        ✏
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                      onClick={() => { setOpenNoteId(topic._id); setNoteText(""); }}
                    >
                      <span className="text-blue-500">📝</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden md:flex justify-center items-center">
                {isCompleted ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : (
                  <span className="text-gray-400 text-xl">○</span>
                )}
              </div>

              <div className="hidden md:block pl-2">
                <div className={`font-semibold text-base ${
                  isCompleted ? "text-green-800" : 
                  topic._id === activeTopic ? "text-indigo-800" : "text-gray-800"
                }`}>
                  {topic.title}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{topic.notes}</div>
              </div>

              <div className="hidden md:block">
                {gfg ? (
                  <a href={gfg.url} target="_blank" rel="noreferrer" className="inline-block hover:scale-110 transition-transform">
                    <img src={getIconUrl("article", gfg.url)} className="w-6 h-6" alt="GFG" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="hidden md:block">
                {yt ? (
                  <a href={yt.url} target="_blank" rel="noreferrer" className="inline-block hover:scale-110 transition-transform">
                    <img src={getIconUrl("video", yt.url)} className="w-6 h-6" alt="YouTube" />
                  </a>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="hidden md:block pl-4">
                {topic.type === "Important" ? (
                  <button 
                    onClick={() => handleSingleTopicQuiz(topic.title)} 
                    disabled={topic._id !== activeTopic}
                    className={`px-2 py-1 text-xs rounded border transition-all ${
                      topic._id === activeTopic 
                        ? "bg-gradient-to-br from-purple-100 to-purple-50 hover:from-purple-200 hover:to-purple-100 text-purple-800 border-purple-200"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    Quiz
                  </button>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </div>
              
              <div className="hidden md:block pl-5">
                <button 
                  onClick={() => updateProgress(topic._id, "isBookmarked")}
                  className="text-2xl hover:scale-110 transition-transform"
                  aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                >
                  {isBookmarked ? (
                    <span className="text-amber-500">🔖</span>
                  ) : (
                    <span className="text-gray-400">📑</span>
                  )}
                </button>
              </div>
              
              <div className="hidden md:block pl-6 relative">
                <button 
                  onClick={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: !prev[topic._id] }))} 
                  className={`text-xl hover:scale-110 transition-transform ${
                    remindOn ? "text-sky-500" : "text-gray-400"
                  }`}
                  aria-label={remindOn ? "Change reminder" : "Set reminder"}
                >
                  {remindOn ? "⏰" : "🕒"}
                </button>
                {showDatePicker[topic._id] && (
                  <input
                    type="date"
                    value={remindOn ? remindOn.split("T")[0] : ""}
                    onChange={(e) => updateProgress(topic._id, "remindOn", e.target.value)}
                    className="absolute top-8 left-0 px-1.5 py-1 border border-gray-300 rounded text-xs bg-white z-10 shadow-md"
                    onBlur={() => setShowDatePicker((prev) => ({ ...prev, [topic._id]: false }))}
                  />
                )}
              </div>

              <div ref={(el) => (noteRefs.current[topic._id] = el)} className="hidden md:block relative">
                {note ? (
                  <div className="flex gap-2 items-center text-xs font-semibold">
                    <span className="text-amber-500">📄</span>
                    <span className="truncate max-w-[100px] text-amber-800">{note}</span>
                    <button 
                      onClick={() => { setOpenNoteId(topic._id); setNoteText(note); }}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Edit note"
                    >
                      ✏
                    </button>
                  </div>
                ) : (
                  <button 
                    className="text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                    onClick={() => { setOpenNoteId(topic._id); setNoteText(""); }}
                  >
                    <span className="text-blue-500">📝</span>
                    <span className="text-blue-600">Add</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Modal */}
      {openNoteId && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4 w-11/12 md:w-96">
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Notes for: {topics.find(t => t._id === openNoteId)?.title}
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={5}
              placeholder="Type your notes here..."
              className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              autoFocus
            />
            <div className="flex justify-between items-center">
              {progress[openNoteId]?.note && (
                <button
                  onClick={() => {
                    updateProgress(openNoteId, "note", "");
                    setOpenNoteId(null);
                  }}
                  className="text-xs px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                >
                  Clear Note
                </button>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => setOpenNoteId(null)} 
                  className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateProgress(openNoteId, "note", noteText);
                    setOpenNoteId(null);
                    toast("Note saved!", { type: "success" });
                  }}
                  className="text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheoryPage;