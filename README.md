# simple-ts-fsrs

A minimal implementation of the FSRS (Free Spaced Repetition Scheduler) algorithm written in TypeScript.

Perfect for creating your own spaced repetition applications.

## Installation

Node.js

```
npx jsr add @austinshelby/simple-ts-fsrs
```

Deno

```
deno add jsr:@austinshelby/simple-ts-fsrs
```

## Quickstart

```ts
import { FSRS } from "@austinshelby/simple-ts-fsrs";

const fsrs = new FSRS();

// Assess the ability to recall information for the first time
const assessment = fsrs.assessRecall({
  rating: "Remembered",
});

// Assess the ability to recall information on subsequent attempts
const newAssessment = fsrs.assessRecall({
  rating: "Forgot",
  previousAssessment: assessment,
});

// Get the current retrievability
const retrievability = assessment.getRetrievability();
```

## Assessment information

The `Assessment` class provides the following data:

- `assessedAt` the time the assessment was done.

- `nextScheduledAssessment` the next optimal time to assess it again. At this moment, there's a 90% chance to recall the information successfully.

- `stability` number of days until the chance to recall the information successfully drops below 90%. The higher the better.

- `difficulty` how difficult it is to change the stability.

- `state` in which state the assessment is currently in (Learning, Review, or Relearning)

## About

`simple-ts-fsrs` offers a lightweight implementation of the FSRS algorithm. Note that it will produce slightly different results compared to other FSRS implementations. It provides only the least amount of information necessary as all the other information (e.g. previous assessments or lapses) required to build a fully fledged spaced repetition apps can be calculated on the application level.

## Used in

- [MandoFlow](https://www.mandoflow.com/). Turn your favorite YouTube videos into personalized Mandarin Chinese language lessons.

## Acknowledgements

Special thanks to the [Open Spaced Repetition](https://github.com/open-spaced-repetition) project and its contributors for their incredible work which served as a significant source of inspiration.
