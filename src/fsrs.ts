import type { Assessment } from "./assessment.ts";
import { AssessmentStrategyFactory } from "./assessment_strategy_factory.ts";
import type { W } from "./mod.ts";
import type { Rating } from "./types.ts";

/** The options bag to pass to the {@link FSRS} constructor */
export interface FSRSOptions {
  /** The desired retention rate. Defaults to 0.9 if unspecified. */
  requestRetention?: number;
  /** The maximum delay in days that an assessment can be scheduled in the future. Defaults to 36500 if unspecified. */
  maximumInterval?: number;
  /** The calculated weights to optimize the scheduling algorithm. Defaults to [0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616, 0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034, 0.6567] if unspecified. */
  w?: W;
}

/**
 * Free Spaced Repetition Scheduler.
 *
 * @example Usage
 * ```ts
 * import { FSRS } from "@austinshelby/simple-ts-fsrs"
 *
 * const fsrs = new FSRS()
 * const assessment = fsrs.assessRecall({
 *   rating: "Remembered",
 * });
 * ```
 */
export class FSRS {
  private readonly assessmentStrategyFactory: AssessmentStrategyFactory;

  /**
   * Create a new scheduler with the given parameters.
   * @param options Options to initialize the scheduler.
   */
  constructor({
    requestRetention = 0.9,
    maximumInterval = 36500,
    w = [
      0.4072, 1.1829, 3.1262, 15.4722, 7.2102, 0.5316, 1.0651, 0.0234, 1.616,
      0.1544, 1.0824, 1.9813, 0.0953, 0.2975, 2.2042, 0.2407, 2.9466, 0.5034,
      0.6567,
    ],
  }: FSRSOptions = {}) {
    this.assessmentStrategyFactory = new AssessmentStrategyFactory({
      requestRetention,
      maximumInterval,
      w,
    });
  }

  /** Assess an ability to recall information */
  assessRecall({
    rating,
    now = new Date(),
    previousAssessment,
  }: {
    rating: Rating;
    now?: Date;
    previousAssessment?: Assessment;
  }): Assessment {
    const assessmentStrategy =
      this.assessmentStrategyFactory.getAssessmentStrategy(previousAssessment);

    const assessment = assessmentStrategy.assess({
      rating,
      now,
    });

    return assessment;
  }
}
