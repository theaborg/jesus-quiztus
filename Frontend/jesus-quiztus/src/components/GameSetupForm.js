import React, { useState } from "react";
import "../styles/GameSetupForm.scss";

/**
 *
 * Här kanske vi vill lägga in fler saker?
 * Tankar:
 * 1. Ska man välja hur många spelare som ska kunna joina varje spel?
 *  1.1 TÄnker typ kahoot versionen. En öppen länk och alla kan joina.
 *  1.2 Eller så är det bara en invitad spelare som kan joina?
 * 2. Kanske bör kunna skriva in någon slags join kod i DB också så att andra spelare kan joina?
 *
 */

const GameSetupForm = ({ onStart, onClose }) => {
  const [formData, setFormData] = useState({
    amount: 5,
    category: "",
    difficulty: "",
    type: "",
    encoding: "",
  });

  const categories = [
    { id: "", name: "Any Category" },
    { id: 9, name: "General Knowledge" },
    { id: 10, name: "Entertainment: Books" },
    { id: 11, name: "Entertainment: Film" },
    { id: 12, name: "Entertainment: Music" },
    { id: 13, name: "Entertainment: Musicals & Theatres" },
    { id: 14, name: "Entertainment: Television" },
    { id: 15, name: "Entertainment: Video Games" },
    { id: 16, name: "Entertainment: Board Games" },
    { id: 17, name: "Science & Nature" },
    { id: 18, name: "Science: Computers" },
    { id: 19, name: "Science: Mathematics" },
    { id: 20, name: "Mythology" },
    { id: 21, name: "Sports" },
    { id: 22, name: "Geography" },
    { id: 23, name: "History" },
    { id: 24, name: "Politics" },
    { id: 25, name: "Art" },
    { id: 26, name: "Celebrities" },
    { id: 27, name: "Animals" },
    { id: 28, name: "Vehicles" },
    { id: 29, name: "Entertainment: Comics" },
    { id: 30, name: "Science: Gadgets" },
    { id: 31, name: "Entertainment: Japanese Anime & Manga" },
    { id: 32, name: "Entertainment: Cartoon & Animations" },
  ];

  const difficulties = ["", "easy", "medium", "hard"];
  const types = ["", "multiple", "boolean"];
  //const encodings = ["", "url3986", "base64"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <form className="game-setup-form" onSubmit={handleSubmit}>
          <div className="game-setup-div">
            <div className="form-row">
              <label className="input-label">Number of Questions:</label>
              <input
                className="game-setup-input"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label className="input-label">Category:</label>
              <select
                className="game-setup-input"
                name="category"
                onChange={handleChange}
                value={formData.category}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label className="input-label">Difficulty:</label>
              <select
                className="game-setup-input"
                name="difficulty"
                onChange={handleChange}
                value={formData.difficulty}
              >
                <option value="">Any</option>
                {difficulties.slice(1).map((d) => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <button className="in-app-button" onClick={handleSubmit}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default GameSetupForm;
