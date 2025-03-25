import { assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import { Assessment } from "./assessment.ts";
import { FakeTime } from "@std/testing/time";
import { FSRS } from "./mod.ts";

Deno.test("Retrievability is 1 at the moment of assessment", () => {
  const assessment = new Assessment({
    assessedAt: new Date("2023-01-02T10:36:00.000Z"),
    nextScheduledAssessment: new Date("2023-01-17T21:55:58.080Z"),
    stability: 15.4722,
    difficulty: 3.28285649513529,
    state: "Review",
  });

  const retrievability = assessment.getRetrievability(
    new Date("2023-01-02T10:36:00.000Z")
  );

  assertEquals(retrievability, 1);
});

Deno.test(
  "Retrievability is 0.9 at the moment of next scheduled assessment when scheduled with request retention of 0.9",
  () => {
    const fsrs = new FSRS({requestRetention: 0.9});

    const firstAssessment = fsrs.assessRecall({
      date: new Date("2025-01-01T12:00:00.000Z"),
      rating: "Remembered",
    })

    const secondAssessment = fsrs.assessRecall({
      date: firstAssessment.nextScheduledAssessment,
      rating: "Remembered",
      previousAssessment: firstAssessment
    })

    const retrievability = secondAssessment.getRetrievability(
      secondAssessment.nextScheduledAssessment
    );

    // Doesn't quite match 0.9 probably due to some rounding errors which are not that significant
    assertAlmostEquals(retrievability, 0.9, 0.0000001);
  }
);

Deno.test("Getting retrievability by default uses the current date", () => {
  const assessment = new Assessment({
    assessedAt: new Date("2023-01-02T10:36:00.000Z"),
    nextScheduledAssessment: new Date("2023-01-17T21:55:58.080Z"),
    stability: 15.4722,
    difficulty: 3.28285649513529,
    state: "Review",
  });

  using time = new FakeTime("2023-01-02T10:36:00.000Z");

  const retrievability = assessment.getRetrievability();

  assertEquals(retrievability, 1);
});
