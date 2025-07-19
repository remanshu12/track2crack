import { useEffect, useState } from "react"
import API from "../api/api"

const DSASheet = () => {
  const [questions, setQuestions] = useState([])
  const [progress, setProgress] = useState({}) // keyed by question ID
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, pRes] = await Promise.all([
          API.get("/dsa/questions"),
          API.get(`/dsa/progress/${userId}`)
        ])
        setQuestions(qRes.data || [])
        setProgress(pRes.data?.progress || {})
      } catch (err) {
        console.error("Error loading DSA sheet:", err)
      }
    }

    fetchData()
  }, [userId])

  const handleCheckboxChange = (questionId) => {
    const updated = {
      ...progress,
      [questionId]: {
        ...(progress[questionId] || {}),
        solved: !(progress[questionId]?.solved),
      }
    }
    setProgress(updated)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">DSA Sheet</h1>

      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q._id} className="p-4 border rounded-md bg-white shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{index + 1}. {q.title}</p>
                <p className="text-sm text-gray-600">{q.topic}</p>
              </div>
              <div className="flex gap-4 items-center">
                <label>
                  <input
                    type="checkbox"
                    checked={progress[q._id]?.solved || false}
                    onChange={() => handleCheckboxChange(q._id)}
                  />
                  <span className="ml-2">Solved</span>
                </label>
                {/* You can add buttons for Difficulty & Bookmark later */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DSASheet
