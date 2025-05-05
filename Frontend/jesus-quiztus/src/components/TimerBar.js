import "../styles/TimerBar.scss";
export default function TimerBar({ timeLeft }) {
  // TODO: move this constant?
  const duration = 5; // seconds
  // TODO: fix the inline style, man vill väl ha responsiv längd på vår bar
  return (
    <div
      className="timer-bar"
      style={{ width: `${(timeLeft / duration) * 50}%` }}
    />
  );
}
