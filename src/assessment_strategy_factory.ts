import type { Assessment } from "./assessment.ts";
import {
  type BaseAssessmentStrategy,
  InitialAssessmentStrategy,
  LearningAssessmentStrategy,
  ReviewAssessmentStrategy,
} from "./assessment_strategies.ts";
import type { W } from "./types.ts";

export class AssessmentStrategyFactory {
  private readonly requestRetention: number;
  private readonly maximumInterval: number;
  private readonly w: W;

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

  getAssessmentStrategy(
    previousAssessment?: Assessment,
  ): BaseAssessmentStrategy {
    if (!previousAssessment) {
      return new InitialAssessmentStrategy({
        requestRetention: this.requestRetention,
        maximumInterval: this.maximumInterval,
        w: this.w,
      });
    } else if (["Learning", "Relearning"].includes(previousAssessment.state)) {
      return new LearningAssessmentStrategy({
        requestRetention: this.requestRetention,
        maximumInterval: this.maximumInterval,
        w: this.w,
        previousAssessment: previousAssessment,
      });
    } else {
      return new ReviewAssessmentStrategy({
        requestRetention: this.requestRetention,
        maximumInterval: this.maximumInterval,
        w: this.w,
        previousAssessment: previousAssessment,
      });
    }
  }
}
