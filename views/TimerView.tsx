import { useEffect, useRef, useState } from "react";
import { PomodoroTimerSettings } from "main";


type Props = {
  settings: PomodoroTimerSettings
  quote: Quote
}

interface Quote {
  quote: string
  author: string,
}

const returnCSSVar = (name: string) => {
    return window
		.getComputedStyle(document.body)
		.getPropertyValue(name);
}

const parseCSSVar = (name: string) => {
  name = name.replace(" ", "").substring(4, name.length - 3);
  return name.split(", ");
}

function TimerView({settings, quote}: Props) {
	const [tasks, setTasks] = useState<string[]>([]);
	
	// settings.focus_time * 60
  // timer
	const initialTime = 1 * 60
	const [timeLeft, setTimeLeft] = useState(initialTime);
  const degreesPerSecond = 360 / initialTime;
  const [circularProgress, setCircularProgress] = useState(degreesPerSecond * timeLeft)

  const accentH = returnCSSVar("--accent-h")
  const accentS = returnCSSVar("--accent-s")
  const accentL = returnCSSVar("--accent-l")

  const backgroundSec = parseCSSVar(returnCSSVar("--background-secondary-alt"));

  useEffect(() => {
    if (timeLeft != initialTime) 
      setCircularProgress((prev) => {return prev - degreesPerSecond;});
  }, [timeLeft])

	useEffect(() => {

		// load the tasks
		const savedTasks = localStorage.getItem("pomodoro-timer-tasks");
		if (savedTasks) setTasks(JSON.parse(savedTasks));

		// start the timer
		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}

				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<div id="timer-view">
			<div className="quote-wrapper">
				<p className="quote">{quote.quote}</p>
				<p className="author">- {quote.author}</p>
			</div>
			<div className="timer-wrapper">
				<span
					// #9b51e0
					style={{
						background: `conic-gradient(hsl(${accentH}, ${accentS}, ${accentL}) ${circularProgress}deg, hsl(${backgroundSec[0]}, ${backgroundSec[1]}, ${backgroundSec[2]}) 0deg )`,
					}}
					className="progress-circle"
				>
					<p className="time-text">
						{Math.floor(timeLeft / 60) < 10
							? "0" + Math.floor(timeLeft / 60)
							: Math.floor(timeLeft / 60)}{" "}
						:{" "}
						{timeLeft % 60 < 10
							? "0" + (timeLeft % 60)
							: timeLeft % 60}
					</p>
				</span>
			</div>
			<ul className="todo-list">
				{tasks.map((item, index) => (
					<li className="todo-item" key={index}>
						<input type="checkbox" className="checkbox" />
						<p>{item}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default TimerView