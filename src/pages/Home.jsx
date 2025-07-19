import { useEffect } from 'react';

import {
  Book,
  Brain,
  FileText,
  ListChecks,
  History,
  AlarmClock,
  User,
  BookOpen,
  BarChart,
  Puzzle,
  BookmarkCheck,
  Target,
  BarChart3
} from "lucide-react"; 

const Home = () => {
  // Animation on scroll with faster timing
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-fadeIn, .animate-slideUp, .animate-slideLeft, .animate-slideRight');
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate');
        } else {
          element.classList.remove('animate'); // Reset animation when element is out of view
        }
      });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);

  return (
    <>
      {/* ===== Hero Section ===== */}
      <section className="bg-gradient-to-r from-blue-50 via-white to-purple-50 py-20 px-6 md:px-16 lg:px-24 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-blue-100 opacity-20 animate-float1"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-purple-100 opacity-20 animate-float2"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-blue-100 opacity-20 animate-float3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="animate-slideLeft">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight">
              Master <span className="text-blue-600">DSA</span> & <span className="text-purple-600">Core CS</span><br />
              <span className="font-semibold text-gray-700">With Progress Tracking.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-700">
              Stay organized with smart tracking, curated notes, and chapter-wise quizzes — all in one platform.
            </p>
            <a
              href="/register"
              className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Get Started
            </a>
          </div>

          <div className="w-full h-64 md:h-80 flex items-center justify-center animate-slideRight">
            <img
              src="/assets/heroImage.svg"
              alt="Coding Education"
              className="h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ===== Features Section ===== */}
      <section id="features" className="text-gray-600 body-font bg-white py-24">
        <div className="container px-5 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-blue-500 tracking-widest font-semibold title-font mb-1 animate-fadeIn">
              FEATURES
            </h2>
            <h1 className="sm:text-4xl text-3xl font-bold title-font text-gray-900 animate-fadeIn">
              What You Can Do with Track2Crack
            </h1>
          </div>

          <div className="flex flex-wrap -m-4">
            {/* Feature 1 */}
            <div className="p-4 md:w-1/3 animate-slideUp">
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <Book className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    DSA Sheet Tracker
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    Track progress across structured 450-question DSA sheets. Bookmark, filter by topic, and monitor completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 md:w-1/3 animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Core Subject Notes
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    Study OS, DBMS, CN and more using tagged notes and top resources — all organized by importance.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 md:w-1/3 animate-slideUp" style={{animationDelay: '0.2s'}}>
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    MCQ Quizzes
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    Topic-wise quizzes with real MCQs. Review past attempts, bookmark tricky ones, and boost your prep.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-4 md:w-1/3 animate-slideUp" style={{animationDelay: '0.3s'}}>
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Theory Concept Tracker
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    Track your understanding of DSA, Java, and OOPS theory concepts. Smart quiz-based reinforcement included.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="p-4 md:w-1/3 animate-slideUp" style={{animationDelay: '0.4s'}}>
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Quiz History Review
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    Access and analyze your quiz attempt history. Track accuracy, revisit bookmarks, and stay sharp.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="p-4 md:w-1/3 animate-slideUp" style={{animationDelay: '0.5s'}}>
              <div className="flex rounded-xl h-full bg-gradient-to-br from-white to-blue-50 p-8 flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-blue-100 hover:border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 mr-3 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex-shrink-0 transform transition hover:scale-110 shadow-md">
                    <AlarmClock className="w-5 h-5" />
                  </div>
                  <h2 className="text-gray-900 text-xl font-semibold title-font">
                    Smart Revision Tab
                  </h2>
                </div>
                <div className="flex-grow">
                  <p className="leading-relaxed text-base text-gray-700">
                    All your bookmarked items and reminders in one place — built to help you revise smarter, not harder.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== How It Works Section ===== */}
      <section id="about" className="bg-gray-50 py-20 px-4 md:px-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] bg-repeat"></div>
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 text-sm font-semibold tracking-widest uppercase animate-fadeIn">
              Getting Started
            </h2>
            <h1 className="text-3xl font-bold text-gray-900 animate-fadeIn">How It Works</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl p-8 text-center animate-slideUp group">
              <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8" />
              </div>
              <div className="text-blue-600 font-bold text-2xl mb-3">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Create an Account</h3>
              <p className="leading-relaxed text-gray-700">
                Sign up and personalize your dashboard to start your journey.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl p-8 text-center animate-slideUp group" style={{animationDelay: '0.1s'}}>
              <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="text-blue-600 font-bold text-2xl mb-3">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Start Learning</h3>
              <p className="leading-relaxed text-gray-700">
                Access curated notes, DSA sheets, and theory quizzes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl p-8 text-center animate-slideUp group" style={{animationDelay: '0.2s'}}>
              <div className="mx-auto mb-6 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <BarChart className="w-8 h-8" />
              </div>
              <div className="text-blue-600 font-bold text-2xl mb-3">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Track & Revise</h3>
              <p className="leading-relaxed text-gray-700">
                Monitor your progress, bookmark important content, and revise smartly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Why Choose Us Section ===== */}
      <section className="bg-white py-20 px-6 md:px-16 lg:px-24 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center animate-fadeIn">
          Why Track2Crack?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 animate-slideRight">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 hover:scale-110 transition-transform duration-300">
              <Puzzle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">All-in-One Prep</h3>
              <p className="text-gray-600 mt-1">No juggling between platforms — everything from DSA to core CS in one place.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 animate-slideLeft">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 hover:scale-110 transition-transform duration-300">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Smart Tracking</h3>
              <p className="text-gray-600 mt-1">Track progress, bookmark tricky topics, and set reminders to revise.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 animate-slideRight">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 hover:scale-110 transition-transform duration-300">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Focused Learning</h3>
              <p className="text-gray-600 mt-1">No fluff — curated content for what actually matters in placements.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300 animate-slideLeft">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 hover:scale-110 transition-transform duration-300">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Distraction-Free UI</h3>
              <p className="text-gray-600 mt-1">Minimalist design that keeps you focused on learning and nothing else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section id="contact" className="bg-white py-20 px-6 md:px-16 lg:px-24 border-t border-gray-200">
        <div className="text-center max-w-2xl mx-auto animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-4">
            Have a question, feedback, or need support? We'd love to hear from you.
          </p>
          <p className="text-blue-600 font-medium text-lg">
            Email: <a href="mailto:support@track2crack.in" className="underline hover:text-blue-700 transition-colors duration-300">support@track2crack.in</a>
          </p>
        </div>
      </section>

      {/* Animation Styles */}
      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        
        .animate-slideUp {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        
        .animate-slideLeft {
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        
        .animate-slideRight {
          opacity: 0;
          transform: translateX(20px);
          transition: opacity 0.4s ease-out, transform 0.4s ease-out;
        }
        
        .animate {
          opacity: 1;
          transform: translateX(0) translateY(0);
        }
        
        @keyframes float1 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(15px) translateX(-15px); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-10px); }
        }
        
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        
        .animate-float2 {
          animation: float2 10s ease-in-out infinite;
        }
        
        .animate-float3 {
          animation: float3 12s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default Home;