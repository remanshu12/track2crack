import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DSASheet from './pages/DSASheet';
import IntroLoader from './components/IntroLoader';
import DSA from './pages/theory/DSA';
import Java from './pages/theory/Java';
import OOPS from './pages/theory/OOPS';
import Quiz from "./pages/quiz/Quiz";
import QuizHistory from "./pages/quiz/QuizHistory";
import Profile from './pages/Profile';
import MainHistory from './pages/MainHistory';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoaderFinish = () => {
    setIsLoading(false);
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen relative">
        {isLoading && <IntroLoader onFinish={handleLoaderFinish} />}

        {!isLoading && (
          <>
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dsa" element={<DSASheet />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/quiz/history" element={<QuizHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard/mainHistory" element={<MainHistory />} />

                {/* ✅ Dashboard Route with nested theory subjects */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/theory/dsa" element={<DSA />} />
                <Route path="/theory/java" element={<Java />} />
                <Route path="/dashboard/theory/oops" element={<OOPS />} />
              </Routes>
            </div>
            <Footer />
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
