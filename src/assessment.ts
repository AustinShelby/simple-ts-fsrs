import type { State } from "./types.ts";

/** Parameters to pass to the {@link Assessment} class constructor. */
export interface AssessmentParams {
  /** The date when the assessment was assessed at. */
  assessedAt: Date;
  /** The optimal date when the information should be recalled the next time. */
  nextScheduledAssessment: Date;
  /** The memory stability. */
  stability: number;
  /** The difficulty of increasing memory stabililty after a recall. */
  difficulty: number;
  /** The current learning state of the information assessed. */
  state: State;
}

/** An assessment of an ability to recall information. */
export class Assessment {
  readonly assessedAt: Date;
  readonly nextScheduledAssessment: Date;
  readonly stability: number;
  readonly difficulty: number;
  readonly state: State;

  /** Construct a new assessment.
   *
   * @param assessmentParams Parameters for the assessment.
   */
  constructor({
    assessedAt,
    nextScheduledAssessment,
    stability,
    difficulty,
    state,
  }: AssessmentParams) {
    this.assessedAt = assessedAt;
    this.nextScheduledAssessment = nextScheduledAssessment;
    this.stability = stability;
    this.difficulty = difficulty;
    this.state = state;
  }

  /** Calculate retrievability at a point in time.
   *
   * @param date Date to calculate the retrievability.
   */
  public getRetrievability(date: Date = new Date()): number {
    const elapsedDays = (date.getTime() - this.assessedAt.getTime()) / 86400000;

    return Math.pow(1 + (19 / 81) * (elapsedDays / this.stability), -0.5);
  }
}
