import { useState } from "react";
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ChartBarIcon,
  CodeBracketIcon,
  ServerIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  Bars3Icon,
  XMarkIcon,
  TvIcon,
  CircleStackIcon,
  CpuChipIcon,
  BoltIcon,
  CubeIcon,
  ClockIcon,
  DocumentTextIcon
} from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const Sidebar = () => {
  const [showCoreMenu, setShowCoreMenu] = useState(false);
  const [showTheoryMenu, setShowTheoryMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const handleCoreClick = async (subject) => {
    const [topicRes, progressRes] = await Promise.all([
      API.get(`/core/topics?subject=${subject}`),
      API.get(`/core/progress/${userId}`),
    ]);
    console.log("Core:", subject, topicRes.data, progressRes.data);
    // Add navigation for core subjects
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

  const handleTheoryClick = async (subject) => {
    const [topicRes, progressRes] = await Promise.all([
      API.get(`/theory/topics?subject=${subject}`),
      API.get(`/theory/progress/${userId}`),
    ]);
    console.log("Theory:", subject, topicRes.data, progressRes.data);
    
    // Navigate to the respective theory page under dashboard
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

  const coreIcons = {
    "CN": <TvIcon className="w-4 h-4 mr-2" />,
    "DBMS": <CircleStackIcon className="w-4 h-4 mr-2" />,
    "OS": <CpuChipIcon className="w-4 h-4 mr-2" />
  };

  const theoryIcons = {
    "DSA": <CodeBracketIcon className="w-4 h-4 mr-2" />,
    "Java": <BoltIcon className="w-4 h-4 mr-2" />,
    "OOPS": <CubeIcon className="w-4 h-4 mr-2" />
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Bars3Icon className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-30 bg-black/50 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`} 
           onClick={() => setIsSidebarOpen(false)}></div>
      
      <aside className={`  md:relative z-40 w-64 h-screen text-indigo-600 border-indigo-600 flex flex-col shadow-md shadow-purple-400 transition-all duration-300 ${isSidebarOpen ? 'left-0' : '-left-64 md:left-0'} shadow-xl`}>
        {/* Sidebar Content Container */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Logo and Top Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-md">
              <div className="text-white text-2xl font-bold tracking-wider">
                <span className="text-indigo-200">Track</span>
                <span className="text-white">2</span>
                <span className="text-yellow-300">Crack</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-1">
            <button 
              onClick={() => navigate("/dashboard")}
              className="flex items-center px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
            >
              <ChartBarIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
              <span className="font-medium">Dashboard</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Theory Subjects */}
            <div>
              <button 
                onClick={() => setShowTheoryMenu(!showTheoryMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
              >
                <div className="flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
                  <span className="font-medium">Theory Subjects</span>
                </div>
                {showTheoryMenu ? (
                  <ChevronDownIcon className="w-4 h-4 text-indigo-600 group-hover:text-indigo-600" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-indigo-600 group-hover:text-white" />
                )}
              </button>
              {showTheoryMenu && (
                <div className="ml-8 mt-2 space-y-1">
                  {["DSA", "Java", "OOPS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => handleTheoryClick(subject)} 
                      className="flex items-center w-full px-3 py-2 rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm transition-all hover:translate-x-1 border border-transparent hover:border-indigo-500"
                    >
                      {theoryIcons[subject]}
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Subjects */}
            <div>
              <button 
                onClick={() => setShowCoreMenu(!showCoreMenu)} 
                className="flex justify-between items-center w-full px-4 py-3 rounded-lg text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
              >
                <div className="flex items-center">
                  <ServerIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
                  <span className="font-medium">Core Subjects</span>
                </div>
                {showCoreMenu ? (
                  <ChevronDownIcon className="w-4 h-4 text-indigo-200 group-hover:text-white" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-indigo-200 group-hover:text-white" />
                )}
              </button>
              {showCoreMenu && (
                <div className="ml-8 mt-2 space-y-1">
                  {["CN", "DBMS", "OS"].map(subject => (
                    <button 
                      key={subject} 
                      onClick={() => handleCoreClick(subject)} 
                      className="flex items-center w-full px-3 py-2 rounded-md text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm transition-all hover:translate-x-1 border border-transparent hover:border-indigo-500"
                    >
                      {coreIcons[subject]}
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quiz History */}
            <button 
              onClick={() => navigate("/dashboard/quizhistory")}
              className="flex items-center px-4 py-3 rounded-lg  text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
            >
              <DocumentTextIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
              <span className="font-medium">Quiz History</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Reminders */}
            <button 
              onClick={() => navigate("/dashboard/revision-planner")}
              className="flex items-center px-4 py-3 rounded-lg  text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
            >
              <ClockIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
              <span className="font-medium">Revision Planner</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => navigate("/dashboard/settings")}
              className="flex items-center px-4 py-3 rounded-lg  text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
              <span className="font-medium">Settings</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>

            {/* Support */}
            <button 
              onClick={() => navigate("/dashboard/support")}
              className="flex items-center px-4 py-3 rounded-lg  text-indigo-600 hover:bg-indigo-400 hover:shadow-md transition-all group border border-transparent hover:border-indigo-500"
            >
              <LifebuoyIcon className="w-5 h-5 mr-3 text-indigo-200 group-hover:text-white" />
              <span className="font-medium">Support</span>
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;