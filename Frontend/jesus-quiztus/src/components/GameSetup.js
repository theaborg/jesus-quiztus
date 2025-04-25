import React, { useState } from "react";

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
    { id: 23, name: "History" },
    { id: 17, name: "Science & Nature" },
  ];

  const difficulties = ["", "easy", "medium", "hard"];
  const types = ["", "multiple", "boolean"];
  const encodings = ["", "url3986", "base64"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <select name="category" onChange={handleChange} value={formData.category}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Difficulty:
        <select name="difficulty" onChange={handleChange} value={formData.difficulty}>
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

      <label>
        Encoding:
        <select name="encoding" onChange={handleChange} value={formData.encoding}>
          <option value="">Default</option>
          {encodings.slice(1).map((e) => (
            <option key={e} value={e}>
              {e.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <button type="submit">Start Game</button>
    </form>
  );
};

export default GameSetupForm;
