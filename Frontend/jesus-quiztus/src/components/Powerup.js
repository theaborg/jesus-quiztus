/**
 * Några tankar om powerups
 */

const powerups = [
  {
    type: "Eliminate Two",
    description: "Eliminate two incorrect answers.",
    effect: (question) => {
      console.log("Eliminating two incorrect answers");
      // Logic to mark two incorrect answers
      // You can implement this later as needed
    },
  },
  {
    type: "Remove Words",
    description: "Every other word in the question is removed.",
    effect: (question) => {
      const words = question.split(" ");
      const replaced = words.map((word, i) => (i % 2 === 1 ? "____" : word));
      return replaced.join(" ");
    },
  },
  {
    type: "Shuffle Answers",
    description: "Shuffling / mixing answers every second (or so).",
    effect: (answers) => {
      return answers.sort(() => Math.random() - 0.5);
    },
  },
];

export const getRandomPowerup = () => {
  const index = Math.floor(Math.random() * powerups.length);
  return powerups[index];
};

export default powerups;
