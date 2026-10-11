import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-comments',
  title: 'Comments',
  blurb: 'Leave notes in your code that Java ignores.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Notes for humans',
      text:
        "A **comment** is text that Java completely ignores. Comments explain *why* code does something, for you and for other people reading it later.",
    },
    {
      type: 'lesson',
      title: 'Single-line comments',
      text:
        "Two slashes `//` start a comment that lasts until the end of the line. It can sit on its own line or after some code.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            // This line is a comment and is not run
            System.out.println("Hello!"); // a comment after code
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Multi-line comments',
      text:
        "For longer notes, start with `/*` and end with `*/`. Everything in between is ignored, even across many lines.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            /* This program greets the player.
               It was written on a rainy day
               in the meadow. */
            System.out.println("Welcome back!");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Switching code off',
      text:
        "Programmers often **comment out** a line to switch it off for a while without deleting it. Just put `//` in front of it.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("This runs.");
            // System.out.println("This does not.");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which of these is a multi-line comment?',
      options: ['`// note`', '`/* note */`', '`<!-- note -->`', '`# note`'],
      answer: 1,
      explain: 'Java multi-line comments start with `/*` and end with `*/`.',
    },
    {
      type: 'blank',
      question: 'Turn this line into a single-line comment.',
      code: '___ System.out.println("Hidden");',
      answers: ['//'],
      explain: 'Two slashes `//` make the rest of the line a comment.',
    },
  ],
  challenges: [
    {
      title: 'Silence the Trolls',
      story:
        "Mischievous trolls sneaked lines into your scroll! **Comment out** the troll lines (don't delete them) so the program prints only:\n\n" +
        "```\nThe sun rises over the meadow.\nBirds sing a happy song.\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("The sun rises over the meadow.");
            System.out.println("TROLLS RULE!");
            System.out.println("Birds sing a happy song.");
            System.out.println("Hehehe, the trolls were here.");
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("The sun rises over the meadow.");
            // System.out.println("TROLLS RULE!");
            System.out.println("Birds sing a happy song.");
            // System.out.println("Hehehe, the trolls were here.");
          }
        }
      `,
      hints: ['Put // at the start of each troll line.', 'There are two troll lines: the second and the fourth.'],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Only the peaceful lines are printed',
            expected: out`
              The sun rises over the meadow.
              Birds sing a happy song.
            `,
          },
        ],
      },
    },
  ],
};

export default level;
