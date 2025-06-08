/**
 * Några tankar om powerups
 */

const powerups = [
  {
    type: "Eliminate Two",
    description: "Eliminate two incorrect answers.",
    effect: (alternatives, question) => {
      const incorrectAlternatives = alternatives.filter(
        (alternative) => alternative != question.correct
      );
      const newAnswers = [
        incorrectAlternatives[1],
        question.correct,
      ];
      return newAnswers;
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
