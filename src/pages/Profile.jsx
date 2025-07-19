import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.userId);
    } catch (err) {
      console.error("Invalid token");
      localStorage.clear();
      window.location.href = "/login";
    }
  }, [token]);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/dashboard/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    fetchData();
  }, [userId, token]);

  if (!data) return <div className="p-6">Loading Profile...</div>;

  const countCompleted = (arr, key = "isCompleted") =>
    Array.isArray(arr) ? arr.filter((item) => item[key]).length : 0;

  const dsaDone = countCompleted(data.dsaProgress);
  const coreDone = countCompleted(data.coreProgress);

  const theoryJava = countCompleted(data.theoryProgress?.filter(t => t.topicId.subject === "Java"));
  const theoryOOPS = countCompleted(data.theoryProgress?.filter(t => t.topicId.subject === "OOPS"));
  const theoryDSA = countCompleted(data.theoryProgress?.filter(t => t.topicId.subject === "DSA"));

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">👤 Your Profile</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-4 bg-gray-50 border rounded-lg shadow text-center">
          <p className="font-semibold text-gray-700">📘 DSA Completed</p>
          <p className="text-lg text-green-600">{dsaDone}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded-lg shadow text-center">
          <p className="font-semibold text-gray-700">🧠 Core Completed</p>
          <p className="text-lg text-green-600">{coreDone}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded-lg shadow text-center">
          <p className="font-semibold text-gray-700">☕ Java Theory</p>
          <p className="text-lg text-indigo-600">{theoryJava}</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded-lg shadow text-center">
          <p className="font-semibold text-gray-700">🧬 OOPS Theory</p>
          <p className="text-lg text-indigo-600">{theoryOOPS}</p>
        </div>
        <div className="col-span-2 p-4 bg-gray-50 border rounded-lg shadow text-center">
          <p className="font-semibold text-gray-700">📈 DSA Theory</p>
          <p className="text-lg text-indigo-600">{theoryDSA}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📝 Recent Quizzes</h3>
        {data.quizHistory.length === 0 ? (
          <p className="text-gray-500">No quizzes attempted yet.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {data.quizHistory.map((q, i) => (
              <li key={i}>
                {q.subject || "Unknown"} - Score: {q.score}/{q.totalQuestions} -{" "}
                {new Date(q.takenAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login";
          }}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
