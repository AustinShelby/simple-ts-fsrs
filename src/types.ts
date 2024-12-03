/** The calculated weights to optimize the scheduling algorithm. */
export type W = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/** The learning state of information. */
export type State = "Learning" | "Review" | "Relearning";

/** The rating of an ability to recall information. */
export type Rating = "Forgot" | "Struggled" | "Remembered" | "Mastered";
