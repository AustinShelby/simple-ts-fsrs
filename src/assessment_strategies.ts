import { Assessment } from "./assessment.ts";
import type { Rating, State, W } from "./types.ts";

export const RatingValues: Record<Rating, number> = {
  Forgot: 1,
  Struggled: 2,
  Remembered: 3,
  Mastered: 4,
};

export abstract class BaseAssessmentStrategy {
  protected readonly requestRetention: number;
  protected readonly maximumInterval: number;
  protected readonly w: W;

  constructor({
    requestRetention,
    maximumInterval,
    w,
  }: {
    requestRetention: number;
    maximumInterval: number;
    w: W;
  }) {
    this.requestRetention = requestRetention;
    this.maximumInterval = maximumInterval;
    this.w = w;
  }

  abstract assess({ rating, date }: { rating: Rating; date: Date }): Assessment;

  protected initDifficulty(rating: Rating) {
    const ratingValue = RatingValues[rating];

    return this.clamp({
      value: this.w[4] - Math.exp(this.w[5] * (ratingValue - 1)) + 1,
      min: 1,
      max: 10,
    });
  }

  protected nextInterval(stability: number): number {
    const interval = stability * 9 * (1 / this.requestRetention - 1);

    return this.clamp({
      value: interval,
      min: 1,
      max: this.maximumInterval,
    });
  }

  protected clamp({
    value,
    min,
    max,
  }: {
    value: number;
    min: number;
    max: number;
  }): number {
    return Math.min(Math.max(value, min), max);
  }

  protected addDaysToDate({ date, days }: { date: Date; days: number }): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  protected addMinutesToDate({
    date,
    minutes,
  }: {
    date: Date;
    minutes: number;
  }): Date {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }
}

export class InitialAssessmentStrategy extends BaseAssessmentStrategy {
  assess({ rating, date }: { rating: Rating; date: Date }): Assessment {
    const stability = this.calculateStability(rating);
    const nextScheduledAssessment = this.scheduleNextAssessment({
      rating,
      date,
      stability,
    });

    return new Assessment({
      assessedAt: date,
      nextScheduledAssessment: nextScheduledAssessment,
      stability,
      difficulty: this.initDifficulty(rating),
      state: this.calculateState(rating),
    });
  }

  // TODO: Build proper learning step functionality if deemed necessary
  private scheduleNextAssessment({
    rating,
    date,
    stability,
  }: {
    rating: Rating;
    date: Date;
    stability: number;
  }): Date {
    if (rating === "Mastered") {
      const masteredInterval = this.nextInterval(stability);
      return this.addDaysToDate({
        date: date,
        days: masteredInterval,
      });
    } else {
      const minutesByRating: Record<Exclude<Rating, "Mastered">, number> = {
        Forgot: 1,
        Struggled: 5,
        Remembered: 10,
      };
      return this.addMinutesToDate({
        date: date,
        minutes: minutesByRating[rating],
      });
    }
  }

  private calculateStability(rating: Rating): number {
    const ratingValue = RatingValues[rating];

    return this.w[ratingValue - 1];
  }

  private calculateState(rating: Rating): State {
    const newStateLookupTable: Record<Rating, State> = {
      Forgot: "Learning",
      Struggled: "Learning",
      Remembered: "Learning",
      Mastered: "Review",
    };

    return newStateLookupTable[rating];
  }
}

abstract class AssessmentStrategy extends BaseAssessmentStrategy {
  protected readonly previousAssessment: Assessment;

  constructor({
    requestRetention,
    maximumInterval,
    w,
    previousAssessment,
  }: {
    requestRetention: number;
    maximumInterval: number;
    w: W;
    previousAssessment: Assessment;
  }) {
    super({
      requestRetention,
      maximumInterval,
      w,
    });
    this.previousAssessment = previousAssessment;
  }

  protected calculateDifficulty({
    difficulty,
    rating,
  }: {
    difficulty: number;
    rating: Rating;
  }): number {
    const nextDifficulty = difficulty - this.w[6] * (RatingValues[rating] - 3);

    return this.clamp({
      value:
        this.w[7] * this.initDifficulty("Mastered") +
        (1 - this.w[7]) * nextDifficulty,
      min: 1,
      max: 10,
    });
  }
}

export class LearningAssessmentStrategy extends AssessmentStrategy {
  assess({ rating, date }: { rating: Rating; date: Date }): Assessment {
    const stability = this.calculateStability({
      stability: this.previousAssessment.stability,
      rating,
    });

    return new Assessment({
      assessedAt: date,
      nextScheduledAssessment: this.scheduleNextAssessment({
        rating,
        stability,
        date,
      }),
      stability: stability,
      difficulty: this.calculateDifficulty({
        difficulty: this.previousAssessment.difficulty,
        rating,
      }),
      state: this.calculateNextState({
        rating,
        state: this.previousAssessment.state,
      }),
    });
  }

  private calculateStability({
    stability,
    rating,
  }: {
    stability: number;
    rating: Rating;
  }) {
    return (
      stability * Math.exp(this.w[17] * (RatingValues[rating] - 3 + this.w[18]))
    );
  }

  private scheduleNextAssessment({
    rating,
    stability,
    date,
  }: {
    rating: Rating;
    stability: number;
    date: Date;
  }): Date {
    if (rating === "Forgot") {
      return this.addMinutesToDate({ date: date, minutes: 5 });
    } else if (rating === "Struggled") {
      return this.addMinutesToDate({ date: date, minutes: 10 });
    } else {
      const interval = this.nextInterval(stability);

      return this.addDaysToDate({
        date: date,
        days: interval,
      });
    }
  }

  private calculateNextState({
    rating,
    state,
  }: {
    rating: Rating;
    state: State;
  }): State {
    if (new Set(["Forgot", "Struggled"]).has(rating)) {
      return state;
    } else {
      return "Review";
    }
  }
}

export class ReviewAssessmentStrategy extends AssessmentStrategy {
  private readonly intervalModifier: number;

  constructor({
    requestRetention,
    maximumInterval,
    w,
    previousAssessment,
  }: {
    requestRetention: number;
    maximumInterval: number;
    w: W;
    previousAssessment: Assessment;
  }) {
    super({
      requestRetention,
      maximumInterval,
      w,
      previousAssessment,
    });

    this.intervalModifier =
      (Math.pow(requestRetention, 1 / -0.5) - 1) / (19 / 81);
  }

  assess({ rating, date }: { rating: Rating; date: Date }): Assessment {
    const stability = this.calculateStability({
      previousStability: this.previousAssessment.stability,
      rating,
      previouslyAssessedAt: this.previousAssessment.assessedAt,
      previousDifficulty: this.previousAssessment.difficulty,
      date,
    });

    return new Assessment({
      assessedAt: date,
      nextScheduledAssessment: this.scheduleNextAssessment({
        rating,
        stability,
        date,
      }),
      stability: stability,
      difficulty: this.calculateDifficulty({
        difficulty: this.previousAssessment.difficulty,
        rating,
      }),
      state: this.calculateNextState(rating),
    });
  }

  private calculateNextState(rating: Rating) {
    if (rating === "Forgot") {
      return "Relearning";
    } else {
      return "Review";
    }
  }

  private scheduleNextAssessment({
    rating,
    date,
    stability,
  }: {
    rating: Rating;
    date: Date;
    stability: number;
  }) {
    if (rating === "Forgot") {
      return new Date(date.getTime() + 5 * 60 * 1000);
    } else {
      const interval = this.clamp({
        value: Math.round(stability * this.intervalModifier),
        min: 1,
        max: this.maximumInterval,
      });

      return this.addDaysToDate({
        date: date,
        days: interval,
      });
    }
  }

  private calculateStability({
    previousStability,
    previouslyAssessedAt,
    previousDifficulty,
    date,
    rating,
  }: {
    previousStability: number;
    previouslyAssessedAt: Date;
    previousDifficulty: number;
    date: Date;
    rating: Rating;
  }) {
    const newElapsedDays =
      (date.getTime() - previouslyAssessedAt.getTime()) / 86400000;

    const retrievability = Math.pow(
      1 + (19 / 81) * (newElapsedDays / previousStability),
      -0.5
    );

    if (rating === "Forgot") {
      return this.calculateForgetStability({
        difficulty: previousDifficulty,
        retrievability,
        stability: previousStability,
      });
    } else {
      return this.calculateRecallStability({
        difficulty: previousDifficulty,
        retrievability,
        stability: previousStability,
        rating,
      });
    }
  }

  private calculateForgetStability({
    difficulty,
    stability,
    retrievability,
  }: {
    difficulty: number;
    stability: number;
    retrievability: number;
  }) {
    return Math.min(
      this.w[11] *
        Math.pow(difficulty, -this.w[12]) *
        (Math.pow(stability + 1, this.w[13]) - 1) *
        Math.exp(this.w[14] * (1 - retrievability)),
      stability
    );
  }

  private calculateRecallStability({
    difficulty,
    stability,
    retrievability,
    rating,
  }: {
    difficulty: number;
    stability: number;
    retrievability: number;
    rating: Exclude<Rating, "Forgot">;
  }) {
    return (
      stability *
      (1 +
        Math.exp(this.w[8]) *
          (11 - difficulty) *
          Math.pow(stability, -this.w[9]) *
          (Math.exp((1 - retrievability) * this.w[10]) - 1) *
          this.getDifficultyMultiplier(rating))
    );
  }

  private getDifficultyMultiplier(rating: Exclude<Rating, "Forgot">): number {
    const multiplierMap: Record<Exclude<Rating, "Forgot">, number> = {
      Struggled: this.w[15],
      Remembered: 1,
      Mastered: this.w[16],
    };

    return multiplierMap[rating];
  }
}
