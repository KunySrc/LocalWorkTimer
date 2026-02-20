import React, { useState, useEffect, useRef } from "react";

const WORK_DURATION = 45 * 60;
const BREAK_DURATION = 15 * 60;

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroTimer() {
  const [mode, setMode] = useState("work"); // work | break
  const [seconds, setSeconds] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Timer Logic
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  // Phasenwechsel
  useEffect(() => {
    if (seconds > 0) return;

    // Sound abspielen
    audioRef.current.play();

    if (mode === "work") {
      setMode("break");
      setSeconds(BREAK_DURATION);
    } else {
      setMode("work");
      setSeconds(WORK_DURATION);
    }
  }, [seconds, mode]);

  const total = mode === "work" ? WORK_DURATION : BREAK_DURATION;
  const progress = seconds / total;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{mode === "work" ? "Arbeitsphase 💼" : "Pause ☕"}</h2>

      <svg width="220" height="220">
        <circle
          cx="110"
          cy="110"
          r={RADIUS}
          stroke="#eee"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx="110"
          cy="110"
          r={RADIUS}
          stroke={mode === "work" ? "#4caf50" : "#2196f3"}
          strokeWidth="12"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="28"
          fontWeight="bold"
        >
          {formatTime()}
        </text>
      </svg>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setIsRunning(true)}>▶️</button>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
    </div>
  );
}