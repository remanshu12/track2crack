import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/api";
import TopRightAvatar from "../components/TopRightAvatar";
import { useNavigate } from "react-router-dom";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip, PieController, ArcElement } from 'chart.js';
import { 
  ArrowLeftIcon,
  XMarkIcon,
  TvIcon,
  CircleStackIcon,
  CpuChipIcon,
  BoltIcon,
  CubeIcon,
  CodeBracketIcon,
  ChevronRightIcon
} from "@heroicons/react/24/solid";

// Register Chart.js components
Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, PieController, ArcElement);

const Dashboard = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Complete Binary Trees Practice",
      subject: "DSA",
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      priority: "high",
      completed: false
    },
    {
      id: 2,
      title: "Revise SQL Joins",
      subject: "DBMS",
      dueDate: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
      priority: "medium",
      completed: false
    },
    {
      id: 3,
      title: "Java Interfaces Quiz",
      subject: "Java",
      dueDate: new Date(Date.now() + 3 * 86400000),
      priority: "high",
      completed: false
    },
    {
      id: 4,
      title: "OS Scheduling Algorithms",
      subject: "OS",
      dueDate: new Date(Date.now() + 4 * 86400000),
      priority: "low",
      completed: false
    },
    {
      id: 5,
      title: "OOPS Concepts Revision",
      subject: "OOPS",
      dueDate: new Date(Date.now() + 5 * 86400000),
      priority: "medium",
      completed: false
    }
  ]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const userName = user?.name || "Coder";

  const [avatarUrl, setAvatarUrl] = useState("");
  const [progress, setProgress] = useState({ dsa: [], core: [], theory: [], quiz: [] });
  const [hoveredCard, setHoveredCard] = useState("");
  const chartRef = useRef(null);
  const pieChartRef = useRef(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dsaRes, coreRes, theoryRes, quizRes] = await Promise.all([
          API.get(`/dsa/progress/${userId}`),
          API.get(`/core/progress/${userId}`),
          API.get(`/theory/progress/${userId}`),
          API.get(`/quiz/recent`),
        ]);

        setProgress({
          dsa: dsaRes.data,
          core: coreRes.data,
          theory: theoryRes.data,
          quiz: quizRes.data,
        });
      } catch (err) {
        console.error("\u274C Dashboard data fetch failed:", err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    if (user?.email) {
      const hash = Array.from(user.email).reduce(
        (acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
        0
      );
      const styles = ["adventurer", "avataaars", "bottts", "lorelei", "micah", "miniavs", "open-peeps", "personas", "pixel-art"];
      const avatarStyle = styles[Math.abs(hash) % styles.length];
      setAvatarUrl(`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(user.email)}`);
    }
  }, [user]);

  useEffect(() => {
    if (progress.quiz.length > 0 && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const quizData = [...progress.quiz].reverse();
      const labels = quizData.map((_, index) => `Quiz ${index + 1}`);
      const scores = quizData.map(q => (q.score / q.totalQuestions) * 100);

      chartRef.current.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Quiz Scores (%)',
            data: scores,
            backgroundColor: theme === 'dark' 
              ? [
                'rgba(129, 140, 248, 0.7)',
                'rgba(165, 180, 252, 0.7)',
                'rgba(199, 210, 254, 0.7)',
                'rgba(224, 231, 255, 0.7)',
                'rgba(248, 250, 252, 0.7)'
              ]
              : [
                'rgba(79, 70, 229, 0.7)',
                'rgba(99, 102, 241, 0.7)',
                'rgba(129, 140, 248, 0.7)',
                'rgba(165, 180, 252, 0.7)',
                'rgba(199, 210, 254, 0.7)'
              ],
            borderColor: theme === 'dark' 
              ? 'rgba(165, 180, 252, 1)'
              : 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: theme === 'dark' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)'
              },
              ticks: {
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280',
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: theme === 'dark' ? '#9CA3AF' : '#6B7280'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              titleColor: theme === 'dark' ? '#F3F4F6' : '#111827',
              bodyColor: theme === 'dark' ? '#D1D5DB' : '#4B5563',
              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  const quiz = quizData[context.dataIndex];
                  return `${Math.round(context.raw)}% (${quiz.score}/${quiz.totalQuestions})`;
                }
              }
            }
          }
        }
      });
    }
  }, [progress.quiz, theme]);

  useEffect(() => {
    if (progress.quiz.length > 0 && pieChartRef.current) {
      const ctx = pieChartRef.current.getContext('2d');
      
      if (pieChartRef.current.chart) {
        pieChartRef.current.chart.destroy();
      }

      // Group quiz attempts by subject and calculate average scores
      const subjectData = {};
      progress.quiz.forEach(quiz => {
        const subject = quiz.subject || 'General';
        if (!subjectData[subject]) {
          subjectData[subject] = {
            count: 0,
            totalScore: 0,
            totalQuestions: 0
          };
        }
        subjectData[subject].count++;
        subjectData[subject].totalScore += quiz.score;
        subjectData[subject].totalQuestions += quiz.totalQuestions;
      });

      const subjects = Object.keys(subjectData);
      const averageScores = subjects.map(subject => {
        return Math.round((subjectData[subject].totalScore / subjectData[subject].totalQuestions) * 100);
      });
      const quizCounts = subjects.map(subject => subjectData[subject].count);

      // Color scheme for subjects
      const subjectColors = {
        'CN': 'rgba(59, 130, 246, 0.8)',
        'DBMS': 'rgba(16, 185, 129, 0.8)',
        'OS': 'rgba(139, 92, 246, 0.8)',
        'Java': 'rgba(245, 158, 11, 0.8)',
        'OOPS': 'rgba(236, 72, 153, 0.8)',
        'DSA': 'rgba(239, 68, 68, 0.8)',
        'General': 'rgba(156, 163, 175, 0.8)'
      };

      const borderColors = {
        'CN': 'rgba(59, 130, 246, 1)',
        'DBMS': 'rgba(16, 185, 129, 1)',
        'OS': 'rgba(139, 92, 246, 1)',
        'Java': 'rgba(245, 158, 11, 1)',
        'OOPS': 'rgba(236, 72, 153, 1)',
        'DSA': 'rgba(239, 68, 68, 1)',
        'General': 'rgba(156, 163, 175, 1)'
      };

      pieChartRef.current.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: subjects,
          datasets: [{
            data: averageScores,
            backgroundColor: subjects.map(subject => subjectColors[subject] || subjectColors['General']),
            borderColor: subjects.map(subject => borderColors[subject] || borderColors['General']),
            borderWidth: 1,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                color: theme === 'dark' ? '#E5E7EB' : '#4B5563',
                padding: 20,
                font: {
                  size: 12
                },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
              titleColor: theme === 'dark' ? '#F3F4F6' : '#111827',
              bodyColor: theme === 'dark' ? '#D1D5DB' : '#4B5563',
              borderColor: theme === 'dark' ? '#4B5563' : '#E5E7EB',
              borderWidth: 1,
              padding: 12,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const quizCount = quizCounts[context.dataIndex] || 0;
                  return `${label}: ${value}% (${quizCount} quiz${quizCount !== 1 ? 'zes' : ''})`;
                }
              }
            }
          }
        }
      });
    }
  }, [progress.quiz, theme]);

  const handleCoreClick = (subject) => {
    switch(subject) {
      case "CN":
        navigate("/dashboard/core/cn");
        break;
      case "DBMS":
        navigate("/dashboard/core/dbms");
        break;
      case "OS":
        navigate("/dashboard/core/os");
        break;
      default:
        break;
    }
  };

  const handleTheoryClick = (subject) => {
    switch(subject) {
      case "DSA":
        navigate("/dashboard/theory/dsa");
        break;
      case "Java":
        navigate("/dashboard/theory/java");
        break;
      case "OOPS":
        navigate("/dashboard/theory/oops");
        break;
      default:
        break;
    }
  };

  const handleDSAClick = () => {
    navigate("/dashboard/dsa");
  };

  function countCompleted(list) {
    if (!Array.isArray(list)) return 0;
    return list.filter(item => item.completed).length;
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProgressCard = (title, list, bg, textColor, subSubjects, onClick) => {
    const [selectedCard, setSelectedCard] = useState(null);
    const total = list.length;
    const completed = countCompleted(list);
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Icons for sub-subjects
    const subjectIcons = {
      "CN": <TvIcon className="w-5 h-5 text-blue-500" />,
      "DBMS": <CircleStackIcon className="w-5 h-5 text-green-500" />,
      "OS": <CpuChipIcon className="w-5 h-5 text-purple-500" />,
      "Java": <BoltIcon className="w-5 h-5 text-yellow-500" />,
      "OOPS": <CubeIcon className="w-5 h-5 text-indigo-500" />,
      "DSA": <CodeBracketIcon className="w-5 h-5 text-red-500" />
    };

    const subjectDescriptions = {
      "CN": "Computer Networks concepts and protocols",
      "DBMS": "Database management systems fundamentals",
      "OS": "Operating system principles and concepts",
      "Java": "Java programming language fundamentals",
      "OOPS": "Object-oriented programming concepts",
      "DSA": "Data Structures and Algorithms problems"
    };

    if (selectedCard && selectedCard !== "expand") {
      return (
        <div className={`relative p-6 rounded-2xl shadow-md ${bg}`}>
          <button 
            onClick={() => setSelectedCard(null)}
            className="flex items-center mb-4 text-sm font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to {title}
          </button>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg mr-3">
                {subjectIcons[selectedCard]}
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{selectedCard}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {subjectDescriptions[selectedCard]}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                <span>Progress</span>
                <span className="font-medium">{percent}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600" 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (subSubjects.length > 0) {
      return (
        <div
          className={`relative p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bg}`}
          onClick={() => setSelectedCard("expand")}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
            <span className={`text-sm font-semibold ${textColor}`}>{percent}%</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{completed} of {total} topics mastered</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" 
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          {/* Sub-subjects grid that appears when clicked */}
          {selectedCard === "expand" && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold ${textColor}`}>{title} Subjects</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCard(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {subSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (title === "Core Subjects") {
                        handleCoreClick(subject);
                      } else if (title === "Theory Subjects") {
                        handleTheoryClick(subject);
                      } else {
                        setSelectedCard(subject);
                      }
                    }}
                  >
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-lg mr-3 shadow-sm">
                      {subjectIcons[subject]}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{subject}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {subjectDescriptions[subject]}
                      </p>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 ml-auto text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default card for DSA which has no sub-subjects
    return (
      <div
        className={`relative p-6 rounded-2xl shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${bg}`}
        onClick={onClick || (() => {})}
        onMouseEnter={() => setHoveredCard(title)}
        onMouseLeave={() => setHoveredCard("")}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
          <span className={`text-sm font-semibold ${textColor}`}>{percent}%</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{completed} of {total} topics mastered</p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500" 
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Sidebar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 p-6 pb-10">
        <div className="flex justify-between items-start mb-8">
          <div className="shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">Dashboard</h1>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg shadow-sm inline-block">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                🎊🎊Welcome back 👋, <span className="text-indigo-600 dark:text-indigo-300">{userName}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 italic mt-1">
                "The path remembers your footprints"
              </p>
            </div>
          </div>
          <TopRightAvatar theme={theme} toggleTheme={toggleTheme} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {getProgressCard(
            "DSA Progress", 
            progress.dsa, 
            "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30", 
            "text-purple-800 dark:text-purple-200", 
            [],
            () => navigate("/dashboard/dsa")
          )}
          {getProgressCard(
            "Core Subjects", 
            progress.core, 
            "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30", 
            "text-purple-800 dark:text-purple-200", 
            ["CN", "DBMS", "OS"]
          )}
          {getProgressCard(
            "Theory Subjects", 
            progress.theory, 
            "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30", 
            "text-purple-800 dark:text-purple-200", 
            ["Java", "OOPS", "DSA"]
          )}
        </div>

        {/* Overall Quiz Progress Pie Chart */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30
            text-purple-800 dark:text-purple-200 rounded-xl shadow-md overflow-hidden mb-10">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Overall Quiz Performance by Subject</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <div className="h-64 lg:h-80">
                  <canvas ref={pieChartRef}></canvas>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject Breakdown</h3>
                {progress.quiz.length > 0 ? (
                  <div className="space-y-4">
                    {/* Calculate subject stats */}
                    {(() => {
                      const subjectStats = {};
                      progress.quiz.forEach(quiz => {
                        const subject = quiz.subject || 'General';
                        if (!subjectStats[subject]) {
                          subjectStats[subject] = {
                            count: 0,
                            totalScore: 0,
                            totalQuestions: 0
                          };
                        }
                        subjectStats[subject].count++;
                        subjectStats[subject].totalScore += quiz.score;
                        subjectStats[subject].totalQuestions += quiz.totalQuestions;
                      });

                      return Object.entries(subjectStats).map(([subject, stats]) => {
                        const avgScore = Math.round((stats.totalScore / stats.totalQuestions) * 100);
                        return (
                          <div key={subject} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-800 dark:text-gray-200">{subject}</span>
                              <span className="text-sm font-semibold">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  avgScore >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                  avgScore >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {avgScore}% average
                                </span>
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>{stats.count} quiz{stats.count !== 1 ? 'zes' : ''} taken</span>
                              <span>{stats.totalScore}/{stats.totalQuestions} correct answers</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-2 rounded-full" 
                                style={{ 
                                  width: `${avgScore}%`,
                                  backgroundColor: 
                                    subject === 'CN' ? 'rgba(59, 130, 246, 0.8)' :
                                    subject === 'DBMS' ? 'rgba(16, 185, 129, 0.8)' :
                                    subject === 'OS' ? 'rgba(139, 92, 246, 0.8)' :
                                    subject === 'Java' ? 'rgba(245, 158, 11, 0.8)' :
                                    subject === 'OOPS' ? 'rgba(236, 72, 153, 0.8)' :
                                    subject === 'DSA' ? 'rgba(239, 68, 68, 0.8)' :
                                    'rgba(156, 163, 175, 0.8)'
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No quiz data available. Take some quizzes to see your performance breakdown.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;