import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-for-loop',
  title: 'For Loop',
  blurb: 'Loop an exact number of times, nest loops, and walk through collections.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Three parts in one line',
      text:
        "When you know **how many times** to repeat, use a `for` loop. Its header has three parts separated by semicolons:\n\n" +
        "`for (start; condition; step)`\n\n" +
        "Start runs once, the condition is checked before each round, and the step runs after each round.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            for (int i = 1; i <= 5; i++) {
              System.out.println("Arrow " + i + " fired!");
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Different steps',
      text: "The step doesn't have to be `i++`. You can count by twos, count down, or anything else.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            for (int i = 0; i <= 10; i += 2) {
              System.out.print(i + " ");
            }
            System.out.println();
            for (int i = 3; i > 0; i--) {
              System.out.print(i + " ");
            }
            System.out.println();
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Loops inside loops',
      text:
        "A **nested loop** is a loop inside another loop. The inner loop runs completely for **every** round of the outer loop. Great for grids and patterns!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            for (int row = 1; row <= 3; row++) {
              for (int col = 1; col <= 4; col++) {
                System.out.print("*");
              }
              System.out.println();
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'For-each',
      text:
        "The **for-each** loop visits every item in an array (you'll meet arrays properly soon). Read it as \"for each `item` in `items`\".",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String[] party = {"Ari", "Brom", "Ilsa"};
            for (String hero : party) {
              System.out.println(hero + " joins the quest!");
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does this print?',
      code: 'for (int i = 0; i < 3; i++) {\n  System.out.print(i);\n}',
      options: ['`123`', '`012`', '`0123`', '`3`'],
      answer: 1,
      explain: '`i` starts at 0 and the loop stops before 3: `012`.',
    },
    {
      type: 'choice',
      question: 'An outer loop runs 3 times and its inner loop runs 4 times. How many times does the inner body run in total?',
      options: ['7', '4', '12', '3'],
      answer: 2,
      explain: '4 times for each of the 3 outer rounds: 3 × 4 = **12**.',
    },
  ],
  challenges: [
    {
      title: 'Build the Staircase',
      story:
        "Build a staircase up to the tree house! Use **nested for loops** to print 5 rows, where row `n` has `n` hash signs:\n\n" +
        "```\n#\n##\n###\n####\n#####\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            for (int row = 1; row <= 5; row++) {
              // print 'row' hash signs, then end the line
            }
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            for (int row = 1; row <= 5; row++) {
              for (int i = 1; i <= row; i++) {
                System.out.print("#");
              }
              System.out.println();
            }
          }
        }
      `,
      hints: [
        'Inside the outer loop, add another loop: for (int i = 1; i <= row; i++)',
        'Use System.out.print("#") in the inner loop, and System.out.println() after it to end the row.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Builds five steps',
            expected: out`
              #
              ##
              ###
              ####
              #####
            `,
          },
        ],
      },
    },
  ],
};

export default level;
