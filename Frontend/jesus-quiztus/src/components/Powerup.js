/**
 * Några tankar om powerups
 */

const powerups = [
    {
      name: "Eliminate Two",
      type: "helpful",
      description: "Eliminate two incorrect answers.",
      effect: (question) => {
        // Logic to mark two incorrect answers
        // You can implement this later as needed
      },
    },
    {
      name: "Remove Words",
      type: "harmful",
      description:
        "Every other word in the question is removed.",
      effect: (question) => {
        const words = question.split(" ");
        return words.filter((_, i) => i % 2 === 0).join(" ");
      },
    },
    {
      name: "Shuffle Answers",
      type: "harmful",
      description:
        "Shuffling / mixing answers every second (or so).",
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