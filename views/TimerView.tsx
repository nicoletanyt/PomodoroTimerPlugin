import { useEffect, useState } from "react";

function TimerView() {

  const [tasks, setTasks] = useState<string[]>([]);
  useEffect(() => {
    // load the tasks
    const savedTasks = localStorage.getItem("pomodoro-timer-tasks")
    if (savedTasks) setTasks(JSON.parse(savedTasks))

  }, [])

  return (
		<div>
			<blockquote>Quote</blockquote>
			<div className="timer-wrapper"></div>
			<ul className="todo-list">
        {
          tasks.map((item, index) => (
            <li className="todo-item" key={index}>
              <input type="checkbox" className="checkbox" />
              <p>{item}</p>
            </li>
          ))
        }
			</ul>
		</div>
  );
}

export default TimerView