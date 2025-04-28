import React, { useState } from "react";

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

const GameSetupForm = ({ onStart }) => {
  const [formData, setFormData] = useState({
    amount: 10,
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
  const encodings = ["", "url3986", "base64"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData({
      encoding: "",
    });
    onStart(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of Questions:
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />
      </label>

      <label>
        Category:
        <select
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
      </label>

      <label>
        Difficulty:
        <select
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
      </label>

      <label>
        Type:
        <select name="type" onChange={handleChange} value={formData.type}>
          <option value="">Any</option>
          {types.slice(1).map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </label>
      {/*
      <label>
        Encoding:
        <select
          name="encoding"
          onChange={handleChange}
          value={formData.encoding}
        >
          <option value="">Default</option>
          {encodings.slice(1).map((e) => (
            <option key={e} value={e}>
              {e.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
      */}

      <button type="submit">Start Game</button>
    </form>
  );
};

export default GameSetupForm;
