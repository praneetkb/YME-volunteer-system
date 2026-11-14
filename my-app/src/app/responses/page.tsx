// main volunteer form page

"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResponsesPage() {

  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/getSession", {
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        // Only allow the form to render after authentication succeeds.
        setIsAuthorized(true);

      } catch {
        router.replace("/login");
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const [formData, setFormData] = useState({
    session_date: "",
    facilitator_name: "",
    students_name: "",
    student_absent: "",
    topic: "",
    session_summary: "",
    tech_issues: "",
    student_struggles: "",
    student_strengths: "",
    strategies_used: "",
    next_session_notes: "",
  })

  const [submitted, setSubmitted] = useState(false) // state to show confirmation

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // updates state whenever user types or selects
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  // clears all form fields
  const handleClear = () => {
    setFormData({
      session_date: "",
      facilitator_name: "",
      students_name: "",
      student_absent: "",
      topic: "",
      session_summary: "",
      tech_issues: "",
      student_struggles: "",
      student_strengths: "",
      strategies_used: "",
      next_session_notes: "",
    })
  }

  // submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitted(false);

    try {
        const response = await fetch("/api/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error(`The API returned an unexpected response (HTTP ${response.status}). Check the API route.`);
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not submit feedback.");
        }

        setSubmitted(true);
        handleClear();

    } catch (error) {
        setErrorMessage(
            error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."
        );
    } finally {
        setIsSubmitting(false);
    }
};

if (checkingSession || !isAuthorized) {
    return null;
}

  return (
    <div className="min-h-screen bg-purple-100 flex justify-center p-6">
      {/* outer container centers the form and gives lavender background */}
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8">
        {/* form container */}
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Session Feedback Form</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {submitted && (
            <p className="text-green-700 bg-green-100 p-3 rounded-md">
              Feedback submitted successfully!
            </p>
          )}

          {errorMessage && (
            <p className="text-red-700 bg-red-100 p-3 rounded-md">
              {errorMessage}
            </p>
          )}
          

          <div>
            <label className="block font-medium mb-1 text-gray-800">
              Date of the Session <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="session_date"
              value={formData.session_date}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              required
              className="w-full border border-gray-300 rounded-md p-2 placeholder-gray-300 caret-gray-700
              focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">
              Name of Facilitator <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="facilitator_name"
              value={formData.facilitator_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">
              Name of Student(s) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="students_name"
              value={formData.students_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">Student(s) Absent</label>
            <input
              type="text"
              name="student_absent"
              value={formData.student_absent}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800"> Topic of the Session</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-800">
                Overall comment on how the session was (e.g. Engaged, Distracted, Needed encouragement) <span className="text-red-500">*</span>
                </label>
            <input
              type="text"
              name="session_summary"
              value={formData.session_summary}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">
                Did you experience any techinal issues, either on your end or the student's? <span className="text-red-500">*</span>
                </label>
            <input
              type="text"
              name="tech_issues"
              value={formData.tech_issues}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">Mention what the student struggled with the most <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="student_struggles"
              value={formData.student_struggles}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">Mention an activity or moment when the student performed well <span className="text-red-500">*</span>
            </label>
            <input  
              type="text"
              name="student_strengths"
              value={formData.student_strengths}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>


          <div>
            <label className="block font-medium mb-1 text-gray-800">What strategies or activities worked well in this session? </label>
            <input
              type="text"
              name="strategies_used"
              value={formData.strategies_used}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>

 
          <div>
            <label className="block font-medium mb-1 text-gray-800">Any additional comments for the next session or facilitator? </label>
            <input
              type="text"
              name="next_session_notes"
              value={formData.next_session_notes}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>

          {/* buttons */}    
          <div className="flex justify-between mt-6">
            <button
              type="reset"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-900 text-white font-semibold rounded-lg hover:bg-purple-800 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
