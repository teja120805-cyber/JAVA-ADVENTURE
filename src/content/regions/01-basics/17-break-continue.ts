import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-break-continue',
  title: 'Break/Continue',
  blurb: 'Leave a loop early, or skip straight to the next round.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'break: stop the loop',
      text: "`break` jumps **out** of a loop immediately, even if the condition is still true.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            for (int i = 1; i <= 10; i++) {
              if (i == 4) {
                System.out.println("Found it at " + i + "!");
                break;
              }
              System.out.println("Searching " + i);
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'continue: skip this round',
      text: "`continue` skips the **rest of the current round** and moves on to the next one.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            for (int i = 1; i <= 6; i++) {
              if (i % 2 == 0) {
                continue; // skip even numbers
              }
              System.out.println(i);
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'They work in while loops too',
      text:
        "Both keywords also work in `while` loops. With `continue` in a while loop, make sure the counter still changes, or you'll loop forever!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int i = 0;
            while (i < 5) {
              i++;
              if (i == 3) {
                continue;
              }
              System.out.println("Step " + i);
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `continue` do?',
      options: ['Ends the program', 'Leaves the loop completely', 'Skips to the next round of the loop', 'Restarts the loop from the beginning'],
      answer: 2,
      explain: '`continue` skips the rest of this round; `break` leaves the loop.',
    },
    {
      type: 'choice',
      question: 'What does this print?',
      code: 'for (int i = 1; i <= 5; i++) {\n  if (i == 3) break;\n  System.out.print(i);\n}',
      options: ['`12`', '`1245`', '`123`', '`12345`'],
      answer: 0,
      explain: 'The loop breaks when `i` reaches 3, before printing it: `12`.',
    },
  ],
  challenges: [
    {
      title: 'Search the Chests',
      story:
        "Ten chests line the dungeon. Loop through chests **1 to 10**:\n\n" +
        "- Chests numbered with a multiple of 3 are **trapped**: skip them with `continue`.\n" +
        "- Chest **8** holds the key: print `Found the key in chest 8!` and stop searching with `break`.\n" +
        "- Otherwise print `Opened chest N`.\n\n" +
        "```\nOpened chest 1\nOpened chest 2\nOpened chest 4\nOpened chest 5\nOpened chest 7\nFound the key in chest 8!\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            for (int chest = 1; chest <= 10; chest++) {
              // skip trapped chests, stop at the key, otherwise open
            }
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            for (int chest = 1; chest <= 10; chest++) {
              if (chest % 3 == 0) {
                continue;
              }
              if (chest == 8) {
                System.out.println("Found the key in chest " + chest + "!");
                break;
              }
              System.out.println("Opened chest " + chest);
            }
          }
        }
      `,
      hints: [
        'A multiple of 3 means chest % 3 == 0.',
        'Check for the trap first (continue), then for chest 8 (print and break), then print the normal line.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Finds the key safely',
            expected: out`
              Opened chest 1
              Opened chest 2
              Opened chest 4
              Opened chest 5
              Opened chest 7
              Found the key in chest 8!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
