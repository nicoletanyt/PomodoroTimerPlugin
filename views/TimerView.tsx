function TimerView() {
  return (
    <div>
      <blockquote>Quote</blockquote>
      <div className="timer-wrapper"></div>
      <ul className="todo-list">
        <li className="todo-item">
          <input type="checkbox" className="completed-status"/>
          <input type="text" className="item-name"/>
        </li>
      </ul>
    </div>
  )
}

export default TimerView