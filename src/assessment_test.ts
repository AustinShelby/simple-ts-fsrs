import { assertEquals } from "jsr:@std/assert";
import { Assessment } from "./assessment.ts";
import { FakeTime } from "@std/testing/time";

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

// TODO: Leaky abstraction. 0.9 is heavily tied into the algorithms even though we give it as a parameter 'requestRetention' to FSRS constructor
Deno.test(
  "Retrievability is 0.9 at the moment of next scheduled assessment",
  () => {
    const assessment = new Assessment({
      assessedAt: new Date("2023-01-02T10:36:00.000Z"),
      nextScheduledAssessment: new Date("2023-01-17T21:55:58.080Z"),
      stability: 15.4722,
      difficulty: 3.28285649513529,
      state: "Review",
    });

    const retrievability = assessment.getRetrievability(
      new Date("2023-01-17T21:55:58.080Z")
    );

    assertEquals(retrievability, 0.9);
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
