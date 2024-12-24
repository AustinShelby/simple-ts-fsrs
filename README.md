# simple-ts-fsrs

A minimal implementation of the FSRS (Free Spaced Repetition Scheduler) algorithm written in TypeScript.

## Installation

```
TODO
```

## Quickstart

// TODO: Add more and better examples with explanations

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
  now: new Date(),
  previousAssessment: assessment,
});
```

## About

`simple-ts-fsrs` offers a lightweight implementation of the FSRS algorithm. Note that it will produce slightly different results compared to other FSRS implementations.

## Acknowledgements

Special thanks to the [Open Spaced Repetition](https://github.com/open-spaced-repetition) project and its contributors for their incredible work which served as a significant source of inspiration.
