import { assertEquals } from "jsr:@std/assert";
import { FSRS } from "./mod.ts";
import { Assessment } from "./assessment.ts";

const fsrs = new FSRS();

Deno.test("Regression: Assessing 'Forgot' on 'New'", () => {
  const assessment = fsrs.assessRecall({
    rating: "Forgot",
    date: new Date("2024-12-02T00:00:00.000Z"),
  });

  assertEquals(assessment.difficulty, 7.2102);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:01:00.000Z")
  );
  assertEquals(assessment.assessedAt, new Date("2024-12-02T00:00:00.000Z"));
  assertEquals(assessment.stability, 0.4072);
  assertEquals(assessment.state, "Learning");
});

Deno.test("Regression: Assessing 'Struggled' on 'New'", () => {
  const assessment = fsrs.assessRecall({
    rating: "Struggled",
    date: new Date("2024-12-02T00:00:00.000Z"),
  });

  assertEquals(assessment.difficulty, 6.508547223894037);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:05:00.000Z")
  );
  assertEquals(assessment.assessedAt, new Date("2024-12-02T00:00:00.000Z"));
  assertEquals(assessment.stability, 1.1829);
  assertEquals(assessment.state, "Learning");
});

Deno.test("Regression: Assessing 'Remembered' on 'New'", () => {
  const assessment = fsrs.assessRecall({
    rating: "Remembered",
    date: new Date("2024-12-02T00:00:00.000Z"),
  });

  assertEquals(assessment.difficulty, 5.314577829570867);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:10:00.000Z")
  );
  assertEquals(assessment.assessedAt, new Date("2024-12-02T00:00:00.000Z"));
  assertEquals(assessment.stability, 3.1262);
  assertEquals(assessment.state, "Learning");
});

Deno.test("Regression: Assessing 'Mastered' on 'New'", () => {
  const assessment = fsrs.assessRecall({
    rating: "Mastered",
    date: new Date("2024-12-02T00:00:00.000Z"),
  });

  assertEquals(assessment.difficulty, 3.28285649513529);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-17T11:19:58.080Z")
  );
  assertEquals(assessment.assessedAt, new Date("2024-12-02T00:00:00.000Z"));
  assertEquals(assessment.stability, 15.4722);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Forgot' on 'Learning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.4072,
    difficulty: 7.2102,
    state: "Learning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Forgot",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 9.198653481986167);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:06:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.2070762836105457);
  assertEquals(assessment.state, "Learning");
});

Deno.test("Regression: Assessing 'Struggled' on 'Learning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.4072,
    difficulty: 7.2102,
    state: "Learning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Struggled",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 8.158476821986165);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:11:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.3425738466903332);
  assertEquals(assessment.state, "Learning");
});

Deno.test("Regression: Assessing 'Remembered' on 'Learning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.4072,
    difficulty: 7.2102,
    state: "Learning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Remembered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 7.118300161986166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-03T00:01:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.5667324060003331);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Mastered' on 'Learning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.4072,
    difficulty: 7.2102,
    state: "Learning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Mastered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 6.078123501986166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-03T00:01:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.9375660842587888);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Forgot' on 'Relearning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.54377607,
    difficulty: 8.09306757,
    state: "Relearning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Forgot",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 10);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:06:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.27653027429260296);
  assertEquals(assessment.state, "Relearning");
});

Deno.test("Regression: Assessing 'Struggled' on 'Relearning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.54377607,
    difficulty: 8.09306757,
    state: "Relearning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Struggled",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 9.020685290848165);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-02T00:11:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.4574741160070036);
  assertEquals(assessment.state, "Relearning");
});

Deno.test("Regression: Assessing 'Remembered' on 'Relearning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.54377607,
    difficulty: 8.09306757,
    state: "Relearning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Remembered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 7.980508630848166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-03T00:01:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.7568161111898465);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Mastered' on 'Relearning'", () => {
  const nextScheduledAssessmentDate = new Date("2024-12-02T00:01:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2024-12-02T00:00:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 0.54377607,
    difficulty: 8.09306757,
    state: "Relearning",
  });

  const assessment = fsrs.assessRecall({
    rating: "Mastered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 6.940331970848166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2024-12-03T06:03:55.261Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 1.252028488859364);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Forgot' on 'Review'", () => {
  const nextScheduledAssessmentDate = new Date("2023-01-02T10:36:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2022-12-31T10:36:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 1.25202849,
    difficulty: 6.94033197,
    state: "Review",
  });

  const assessment = fsrs.assessRecall({
    rating: "Forgot",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 8.935100363888164);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2023-01-02T10:41:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 0.6223557099966109);
  assertEquals(assessment.state, "Relearning");
});

Deno.test("Regression: Assessing 'Struggled' on 'Review'", () => {
  const nextScheduledAssessmentDate = new Date("2023-01-02T10:36:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2022-12-31T10:36:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 1.25202849,
    difficulty: 6.94033197,
    state: "Review",
  });

  const assessment = fsrs.assessRecall({
    rating: "Struggled",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 7.894923703888166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2023-01-04T10:36:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 2.2785692875050763);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Remembered' on 'Review'", () => {
  const nextScheduledAssessmentDate = new Date("2023-01-02T10:36:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2022-12-31T10:36:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 1.25202849,
    difficulty: 6.94033197,
    state: "Review",
  });

  const assessment = fsrs.assessRecall({
    rating: "Remembered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 6.854747043888166);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2023-01-08T10:36:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 5.516842771284072);
  assertEquals(assessment.state, "Review");
});

Deno.test("Regression: Assessing 'Mastered' on 'Review'", () => {
  const nextScheduledAssessmentDate = new Date("2023-01-02T10:36:00.000Z");

  const previousAssessment = new Assessment({
    assessedAt: new Date("2022-12-31T10:36:00.000Z"),
    nextScheduledAssessment: nextScheduledAssessmentDate,
    stability: 1.25202849,
    difficulty: 6.94033197,
    state: "Review",
  });

  const assessment = fsrs.assessRecall({
    rating: "Mastered",
    date: nextScheduledAssessmentDate,
    previousAssessment,
  });

  assertEquals(assessment.difficulty, 5.8145703838881655);
  assertEquals(
    assessment.nextScheduledAssessment,
    new Date("2023-01-16T10:36:00.000Z")
  );
  assertEquals(assessment.assessedAt, nextScheduledAssessmentDate);
  assertEquals(assessment.stability, 13.818730251231646);
  assertEquals(assessment.state, "Review");
});
