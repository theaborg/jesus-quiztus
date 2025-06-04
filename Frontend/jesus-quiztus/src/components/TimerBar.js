import "../styles/TimerBar.scss";
export default function TimerBar({ timeLeft }) {
  // TODO: move this constant?
  const DURATION = 10; // seconds
  // TODO: fix the inline style, man vill väl ha responsiv längd på vår bar
  return (
    <div
      className="timer-bar"
      style={{ width: `${(timeLeft / DURATION) * 50}%` }}
    />
  );
}
