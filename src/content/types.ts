// The shape of all game content. Every level lives in its own file under
// src/content/regions/<NN-region>/<NN-level>.ts and default-exports a `Level`.

/** A short story step: the guide explains one idea, optionally with code. */
export interface LessonStep {
  type: 'lesson';
  title: string;
  /** Guide speech. Supports `inline code` and **bold**. Blank lines start new paragraphs. */
  text: string;
  /** A complete runnable program (public class Main first). Shows a "Try it" button. */
  code?: string;
}

export interface ChoiceQuiz {
  type: 'choice';
  question: string;
  /** Optional code shown with the question. */
  code?: string;
  options: string[];
  /** Index into `options`. */
  answer: number;
  explain: string;
}

export interface BlankQuiz {
  type: 'blank';
  question: string;
  /** Code containing exactly one `___` that the player fills in. */
  code: string;
  /** Accepted answers (compared after trimming; case-sensitive like Java). */
  answers: string[];
  explain: string;
}

export type Quiz = ChoiceQuiz | BlankQuiz;
export type FlowItem = LessonStep | Quiz;

/** Run the whole program (optionally with stdin) and compare trimmed stdout. */
export interface OutputTest {
  name: string;
  stdin?: string;
  expected: string;
  /** Hide stdin/expected until the player has failed twice. */
  hidden?: boolean;
}

/** Java statements run inside a hidden Main; whatever they print is compared. */
export interface HarnessTest {
  name: string;
  code: string;
  expected: string;
}

export interface OutputCheck {
  kind: 'output';
  tests: OutputTest[];
}

export interface HarnessCheck {
  kind: 'harness';
  /**
   * 'method': the player writes static method(s) that go inside the hidden Main class.
   * 'class':  the player writes whole classes; the hidden Main is placed before them.
   */
  mode: 'method' | 'class';
  /** Statements for the main() used by the Run button, so players can experiment. */
  demo: string;
  tests: HarnessTest[];
}

export type Check = OutputCheck | HarnessCheck;

export interface Challenge {
  title: string;
  /** Adventure-flavoured task description. Same mini-markup as lesson text. */
  story: string;
  starterCode: string;
  /** Reference solution; `npm run verify-content` makes sure it passes. */
  solution: string;
  /** Set when the starter code is broken on purpose (e.g. a "fix the bug" challenge). */
  starterHasBugs?: boolean;
  /** Unlocked one at a time. Using any hint costs a star. */
  hints: string[];
  check: Check;
}

export interface Level {
  id: string;
  title: string;
  /** Short line shown on the map tooltip and level header. */
  blurb: string;
  boss?: boolean;
  rewards: { xp: number; coins: number };
  flow: FlowItem[];
  challenges: Challenge[];
}

export interface RegionMeta {
  id: string;
  title: string;
  subtitle: string;
  theme: 'meadow' | 'forest' | 'castle';
  badge: { id: string; name: string; emoji: string };
}

export interface Region extends RegionMeta {
  levels: Level[];
}
