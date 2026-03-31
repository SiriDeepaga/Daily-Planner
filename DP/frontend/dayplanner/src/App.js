import React, { useState } from "react";
import "./App.css";
import bg from "./assets/bg.jpeg";

function App() {
  const [page, setPage] = useState("auth");
  const [isRegister, setIsRegister] = useState(false);

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedTheme, setSelectedTheme] = useState(
    "linear-gradient(135deg, #eef2f7, #dfe9f3)"
  );

  // Profile
  const [motto, setMotto] = useState("");
  const [savedMotto, setSavedMotto] = useState("");

  // Todos
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [smallWins, setSmallWins] = useState([]);

  // Events
  const [eventInput, setEventInput] = useState("");
  const [events, setEvents] = useState([]);

  // Diary
  const [diaryText, setDiaryText] = useState("");
  const [savedDiary, setSavedDiary] = useState("");

  // Memories
  const [memoryInput, setMemoryInput] = useState("");
  const [memories, setMemories] = useState([]);

  // Kitty / mood
  const [moodHistory, setMoodHistory] = useState([]);

  const moodReplies = {
    Amazing: "You’re glowing today ✨",
    Good: "That’s lovely. Keep the vibe going 💖",
    Okay: "A calm day is still a valid day 🌷",
    Tired: "Take a little rest. You deserve softness ☁️",
    Sad: "Be gentle with yourself today 🤍",
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    setMessage("");

    try {
      const res = await fetch("https://daily-planner-4.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Registration successful. Please login.");
        setIsRegister(false);
        setRegisterData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  const handleLogin = async () => {
    setMessage("");

    try {
      const res = await fetch("https://daily-planner-4.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
        setPage("welcome");
        setLoginData({
          name: "",
          password: "",
        });
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos([...todos, todoInput]);
    setTodoInput("");
  };

  const completeTodo = (index) => {
    const doneItem = todos[index];
    setSmallWins([...smallWins, doneItem]);
    setTodos(todos.filter((_, i) => i !== index));
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const addEvent = () => {
    if (!eventInput.trim()) return;
    setEvents([
      ...events,
      { text: eventInput, date: selectedDate, done: false },
    ]);
    setEventInput("");
  };

  const toggleEventDone = (index) => {
    const updated = [...events];
    updated[index].done = !updated[index].done;
    setEvents(updated);
  };

  const saveDiary = () => {
    if (!diaryText.trim()) return;
    setSavedDiary(diaryText);
  };

  const addMemory = () => {
    if (!memoryInput.trim()) return;
    setMemories([...memories, { date: selectedDate, text: memoryInput }]);
    setMemoryInput("");
  };

  const addMood = (mood) => {
    setMoodHistory([
      {
        date: selectedDate,
        mood,
        reply: moodReplies[mood],
      },
      ...moodHistory,
    ]);
  };

  const todaysEvents = events.filter((event) => event.date === selectedDate);

  return (
    <>
      {page === "auth" && (
        <div
          className="auth-page"
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="overlay" />

          <div className="card">
            <h1>Plan your day ✨</h1>

            {isRegister ? (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                />
                <button onClick={handleRegister}>Register</button>
                <p className="switch-text" onClick={() => setIsRegister(false)}>
                  Login instead
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={loginData.name}
                  onChange={handleLoginChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <button onClick={handleLogin}>Login</button>
                <p className="switch-text" onClick={() => setIsRegister(true)}>
                  Register
                </p>
              </>
            )}

            {message && <p className="message-text">{message}</p>}
          </div>
        </div>
      )}

      {page === "welcome" && (
        <div className="simple-page" style={{ background: selectedTheme }}>
          <div className="card">
            <h1>Welcome, {user?.name} 💖</h1>
            <p className="page-note">Set your date to continue</p>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button onClick={() => setPage("customize")}>Next</button>
          </div>
        </div>
      )}

      {page === "customize" && (
        <div className="simple-page" style={{ background: selectedTheme }}>
          <div className="card">
            <h1>Choose your vibe</h1>
            <p className="page-note">Pick a clean background style</p>

            <button
              onClick={() =>
                setSelectedTheme("linear-gradient(135deg, #eef2f7, #dfe9f3)")
              }
            >
              Light
            </button>
            <button
              onClick={() =>
                setSelectedTheme("linear-gradient(135deg, #fce7f3, #fdf2f8)")
              }
            >
              Pink
            </button>
            <button
              onClick={() =>
                setSelectedTheme("linear-gradient(135deg, #ecfeff, #e0f2fe)")
              }
            >
              Sky
            </button>

            <button onClick={() => setPage("home")}>Start</button>
          </div>
        </div>
      )}

      {(page === "home" ||
        page === "profile" ||
        page === "calendar" ||
        page === "diary" ||
        page === "memories" ||
        page === "kitty") && (
        <div className="home-layout" style={{ background: selectedTheme }}>
          <aside className="sidebar">
            <h2 className="logo-text">DP</h2>

            <button className="nav-btn" onClick={() => setPage("home")}>
              Home
            </button>
            <button className="nav-btn" onClick={() => setPage("profile")}>
              Profile
            </button>
            <button className="nav-btn" onClick={() => setPage("calendar")}>
              Calendar
            </button>
            <button className="nav-btn" onClick={() => setPage("diary")}>
              Diary
            </button>
            <button className="nav-btn" onClick={() => setPage("memories")}>
              Memories
            </button>
            <button className="nav-btn" onClick={() => setPage("kitty")}>
              Kitty
            </button>
            <button
              className="nav-btn logout-btn"
              onClick={() => {
                setUser(null);
                setPage("auth");
              }}
            >
              Logout
            </button>
          </aside>

          <main className="main-content">
            <div className="top-bar">
              <h1>
                {page === "home" && "Daily Planner"}
                {page === "profile" && "Profile"}
                {page === "calendar" && "Calendar"}
                {page === "diary" && "Diary"}
                {page === "memories" && "Memories"}
                {page === "kitty" && "Kitty Mood"}
              </h1>
              <div className="date-box">{selectedDate}</div>
            </div>

            {page === "home" && (
              <div className="content-grid">
                <div className="content-card">
                  <h2>Todos</h2>
                  <div className="input-row">
                    <input
                      value={todoInput}
                      onChange={(e) => setTodoInput(e.target.value)}
                      placeholder="Add a task..."
                    />
                    <button className="small-btn" onClick={addTodo}>
                      Add
                    </button>
                  </div>

                  {todos.map((todo, index) => (
                    <div key={index} className="list-item">
                      <span>{todo}</span>
                      <div className="action-row">
                        <button
                          className="tiny-btn"
                          onClick={() => completeTodo(index)}
                        >
                          Done
                        </button>
                        <button
                          className="tiny-btn delete-btn"
                          onClick={() => deleteTodo(index)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="content-card">
                  <h2>Events Today</h2>
                  <div className="input-row">
                    <input
                      value={eventInput}
                      onChange={(e) => setEventInput(e.target.value)}
                      placeholder="Add event..."
                    />
                    <button className="small-btn" onClick={addEvent}>
                      Add
                    </button>
                  </div>

                  {todaysEvents.length === 0 && <p>No events for today.</p>}

                  {todaysEvents.map((event, index) => (
                    <div key={index} className="list-item">
                      <span className={event.done ? "done-text" : ""}>
                        {event.text}
                      </span>
                      <button
                        className="tiny-btn"
                        onClick={() => {
                          const originalIndex = events.findIndex(
                            (e) =>
                              e.text === event.text &&
                              e.date === event.date &&
                              e.done === event.done
                          );
                          if (originalIndex !== -1) toggleEventDone(originalIndex);
                        }}
                      >
                        {event.done ? "Undo" : "Done"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="content-card">
                  <h2>Small Wins</h2>
                  {smallWins.length === 0 && <p>No wins yet.</p>}
                  {smallWins.map((win, index) => (
                    <div key={index} className="list-item win-item">
                      <span>{win}</span>
                    </div>
                  ))}
                </div>

                <div className="content-card">
                  <h2>Welcome</h2>
                  <p>Hello, {user?.name} ✨</p>
                  {savedMotto && <p><strong>Motto:</strong> {savedMotto}</p>}
                </div>
              </div>
            )}

            {page === "profile" && (
              <div className="single-panel">
                <div className="content-card">
                  <h2>Your Details</h2>
                  <p className="profile-line">Name: {user?.name}</p>
                  <p className="profile-line">Email: {user?.email}</p>

                  <h3 className="sub-head">Write a motto</h3>
                  <input
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    placeholder="Motto"
                  />
                  <div className="button-row">
                    <button className="small-btn" onClick={() => setSavedMotto(motto)}>
                      Save Motto
                    </button>
                    <button className="small-btn" onClick={() => setMotto(savedMotto)}>
                      Edit
                    </button>
                  </div>

                  {savedMotto && (
                    <p className="saved-text">
                      <strong>Saved Motto:</strong> {savedMotto}
                    </p>
                  )}
                </div>
              </div>
            )}

            {page === "calendar" && (
              <div className="single-panel">
                <div className="content-card">
                  <h2>Pick a Date</h2>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />

                  <h3 className="sub-head">Add Event</h3>
                  <div className="input-row">
                    <input
                      value={eventInput}
                      onChange={(e) => setEventInput(e.target.value)}
                      placeholder="Enter event..."
                    />
                    <button className="small-btn" onClick={addEvent}>
                      Save
                    </button>
                  </div>

                  <h3 className="sub-head">Events on Selected Date</h3>
                  {events.filter((e) => e.date === selectedDate).length === 0 && (
                    <p>No events on this date.</p>
                  )}

                  {events
                    .filter((e) => e.date === selectedDate)
                    .map((event, index) => (
                      <div key={index} className="list-item">
                        <span className={event.done ? "done-text" : ""}>
                          {event.text}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {page === "diary" && (
              <div className="single-panel">
                <div className="content-card diary-card">
                  <h2>Diary Entry</h2>
                  <p className="page-note">{selectedDate}</p>
                  <textarea
                    className="diary-area"
                    value={diaryText}
                    onChange={(e) => setDiaryText(e.target.value)}
                    placeholder="Write about your day..."
                  />
                  <div className="button-row">
                    <button className="small-btn" onClick={saveDiary}>
                      Save
                    </button>
                    <button className="small-btn" onClick={() => setDiaryText(savedDiary)}>
                      Edit
                    </button>
                  </div>

                  {savedDiary && (
                    <div className="saved-block">
                      <h3 className="sub-head">Saved Entry</h3>
                      <p>{savedDiary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {page === "memories" && (
              <div className="single-panel">
                <div className="content-card">
                  <h2>Save a Memory</h2>
                  <div className="input-row">
                    <input
                      value={memoryInput}
                      onChange={(e) => setMemoryInput(e.target.value)}
                      placeholder="Write your memory..."
                    />
                    <button className="small-btn" onClick={addMemory}>
                      Save
                    </button>
                  </div>

                  <h3 className="sub-head">Saved Memories</h3>
                  {memories.length === 0 && <p>No memories yet.</p>}
                  {memories.map((memory, index) => (
                    <div key={index} className="list-item">
                      <span>
                        <strong>{memory.date}:</strong> {memory.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {page === "kitty" && (
              <div className="single-panel">
                <div className="content-card">
                  <h2>How was your day?</h2>
                  <div className="mood-grid">
                    {["Amazing", "Good", "Okay", "Tired", "Sad"].map((mood) => (
                      <button
                        key={mood}
                        className="mood-btn"
                        onClick={() => addMood(mood)}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>

                  <h3 className="sub-head">Mood History</h3>
                  {moodHistory.length === 0 && <p>No mood entries yet.</p>}
                  {moodHistory.map((item, index) => (
                    <div key={index} className="list-item">
                      <span>
                        <strong>{item.date}</strong> — {item.mood} — {item.reply}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}

export default App;
