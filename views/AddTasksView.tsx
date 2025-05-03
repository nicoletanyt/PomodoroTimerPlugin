import { App, Notice } from "obsidian";
import "../styles.css"
import { useEffect, useState } from "react";
import { TIMER_VIEW_TYPE, ADD_TASKS_VIEW_TYPE } from "main";

type Props = {
  app: App,
}

const AddTasksView: React.FC<Props> = ({ app }) => {
  const [tasks, setTasks] = useState<string[]>([]);
  const [inputTask, setInputTask] = useState<string>("");

  const addTask = () => {
    if (inputTask == "") {
      new Notice("Task cannot be empty.")
    } else {
      setTasks((prevTasks) => [...prevTasks, inputTask])
      setInputTask("")
    }
  }

  const changeView = async () => {
    // set localStorage
    localStorage.setItem("pomodoro-timer-tasks", JSON.stringify(tasks))

		const leaf = app.workspace.getRightLeaf(false);
		if (leaf) {
			await leaf.setViewState({
				type: TIMER_VIEW_TYPE,
				active: true,
			});
			app.workspace.revealLeaf(leaf);
		}

    // close this view
		const currentLeaf =
			app.workspace.getLeavesOfType(ADD_TASKS_VIEW_TYPE)[0];
		currentLeaf?.detach();
  };

  return (
		<div id="add-task-view">
			<h1>Pomodoro Timer</h1>
			<p>Add tasks to start the timer!</p>
			<div>
				<input
					onChange={(ev) => setInputTask(ev.target.value)}
					type="text"
					className="name-input"
					value={inputTask}
				/>
				<button id="add-btn" onClick={addTask}>
					Add Task
				</button>
			</div>

			<hr />
			{tasks.length > 0 && <h3>Tasks</h3>}
			<ol className="task-list">
				{tasks.map((item, index) => (
					<li key={index}>{item}</li>
				))}
			</ol>

			<button id="start-button" disabled={tasks.length == 0} onClick={changeView}>
				Start
			</button>
		</div>
  );
}

export default AddTasksView;