import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-boss',
  title: 'The Meadow Dragon',
  blurb: 'Boss battle! Combine loops, conditions and arrays to defeat the dragon.',
  boss: true,
  rewards: { xp: 150, coins: 40 },
  flow: [
    {
      type: 'lesson',
      title: 'The ground trembles...',
      text:
        "A dragon has landed in the meadow! To defeat it you'll need **everything** you've learned: variables, operators, conditions, loops and arrays.\n\n" +
        "The battle has **three trials**. Let's warm up first.",
    },
    {
      type: 'lesson',
      title: 'Battle plan: loop + decide',
      text:
        "Most boss problems follow the same pattern: **loop** over some data, and inside the loop use **if/else** to decide what to do with each item.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int[] damage = {4, 15, 9};
            for (int i = 0; i < damage.length; i++) {
              if (damage[i] >= 10) {
                System.out.println("Hit " + (i + 1) + ": critical!");
              } else {
                System.out.println("Hit " + (i + 1) + ": normal");
              }
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Reading many inputs',
      text:
        "In the last trial, the program reads **several** numbers with a `Scanner`. First read how many there are, then read each one in a loop. " +
        "Numbers can be on the same line or separate lines: `nextInt()` doesn't mind.",
      code: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner("3 10 20 30");
            int count = scanner.nextInt();
            int sum = 0;
            for (int i = 0; i < count; i++) {
              sum += scanner.nextInt();
            }
            System.out.println("Sum: " + sum);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which condition is true for numbers divisible by **both** 3 and 5?',
      options: ['`n % 3 == 0 || n % 5 == 0`', '`n % 3 == 0 && n % 5 == 0`', '`n / 15 == 0`', '`n % 8 == 0`'],
      answer: 1,
      explain: 'Both remainders must be 0, so combine them with `&&`. (That is the same as `n % 15 == 0`.)',
    },
    {
      type: 'choice',
      question: 'You check `n % 3`, `n % 5` and `n % 15` in an if/else-if chain. Which should come **first**?',
      options: ['`n % 3 == 0`', '`n % 5 == 0`', '`n % 15 == 0`', 'The order does not matter'],
      answer: 2,
      explain: 'Check the most specific case first. Otherwise 15 would match `n % 3 == 0` and stop there.',
    },
  ],
  challenges: [
    {
      title: "Trial 1: The Dragon's Hoard",
      story:
        "Before the fight, peek at the dragon's hoard. For each pile in `hoard`, print its number (starting at 1), its gold, and whether it is `big` (10 or more) or `small`. Then print the total:\n\n" +
        "```\nPile 1: 5 gold (small)\nPile 2: 12 gold (big)\nPile 3: 8 gold (small)\nPile 4: 20 gold (big)\nPile 5: 3 gold (small)\nPile 6: 15 gold (big)\nTotal: 63\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int[] hoard = {5, 12, 8, 20, 3, 15};
            // your code here
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int[] hoard = {5, 12, 8, 20, 3, 15};
            int total = 0;
            for (int i = 0; i < hoard.length; i++) {
              String size = hoard[i] >= 10 ? "big" : "small";
              System.out.println("Pile " + (i + 1) + ": " + hoard[i] + " gold (" + size + ")");
              total += hoard[i];
            }
            System.out.println("Total: " + total);
          }
        }
      `,
      hints: [
        'Use an index loop (for int i...) because you need the pile number: i + 1.',
        'Put (i + 1) in brackets inside the String, or Java will join the digits as text.',
        'A ternary works nicely: String size = hoard[i] >= 10 ? "big" : "small";',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Describes the hoard',
            expected: out`
              Pile 1: 5 gold (small)
              Pile 2: 12 gold (big)
              Pile 3: 8 gold (small)
              Pile 4: 20 gold (big)
              Pile 5: 3 gold (small)
              Pile 6: 15 gold (big)
              Total: 63
            `,
          },
        ],
      },
    },
    {
      title: 'Trial 2: Roar and Flame',
      story:
        "The dragon attacks in a rhythm! Count from **1 to 15**. For each number print:\n\n" +
        "- `Dragon!` if it's divisible by both 3 and 5\n- `Roar` if it's divisible by 3\n- `Flame` if it's divisible by 5\n- otherwise, the number itself\n\n" +
        "```\n1\n2\nRoar\n4\nFlame\nRoar\n7\n8\nRoar\nFlame\n11\nRoar\n13\n14\nDragon!\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            for (int n = 1; n <= 15; n++) {
              // decide what to print
            }
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            for (int n = 1; n <= 15; n++) {
              if (n % 15 == 0) {
                System.out.println("Dragon!");
              } else if (n % 3 == 0) {
                System.out.println("Roar");
              } else if (n % 5 == 0) {
                System.out.println("Flame");
              } else {
                System.out.println(n);
              }
            }
          }
        }
      `,
      hints: [
        'Use % to test divisibility: n % 3 == 0 means n divides evenly by 3.',
        'Check "both" (n % 15 == 0) first, then 3, then 5, then print the number.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Follows the rhythm',
            expected: out`
              1
              2
              Roar
              4
              Flame
              Roar
              7
              8
              Roar
              Flame
              11
              Roar
              13
              14
              Dragon!
            `,
          },
        ],
      },
    },
    {
      title: 'Trial 3: The Final Strike',
      story:
        "The dragon has **100 HP**. The input first gives the **number of attacks**, then the damage of each attack.\n\n" +
        "For each attack, lower the dragon's HP and print `Hit for X, dragon HP: Y` (never show HP below 0). " +
        "As soon as HP reaches 0 or less, print `The dragon is defeated!` and stop reading attacks.\n\n" +
        "If the attacks run out first, print `The dragon flies away with Y HP`.\n\nExample input `4 30 25 40 10` prints:\n\n" +
        "```\nHit for 30, dragon HP: 70\nHit for 25, dragon HP: 45\nHit for 40, dragon HP: 5\nHit for 10, dragon HP: 0\nThe dragon is defeated!\n```",
      starterCode: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int attacks = scanner.nextInt();
            int hp = 100;
            // loop over the attacks
          }
        }
      `,
      solution: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int attacks = scanner.nextInt();
            int hp = 100;
            boolean defeated = false;
            for (int i = 0; i < attacks; i++) {
              int damage = scanner.nextInt();
              hp -= damage;
              System.out.println("Hit for " + damage + ", dragon HP: " + Math.max(0, hp));
              if (hp <= 0) {
                defeated = true;
                break;
              }
            }
            if (defeated) {
              System.out.println("The dragon is defeated!");
            } else {
              System.out.println("The dragon flies away with " + hp + " HP");
            }
          }
        }
      `,
      hints: [
        'Inside a for loop that runs attacks times, read each damage with scanner.nextInt().',
        'Math.max(0, hp) never goes below 0, which is handy for printing.',
        'Use a boolean (e.g. defeated) and break when hp <= 0; after the loop, decide which final line to print.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Defeats the dragon on the last hit',
            stdin: '4\n30 25 40 10',
            expected: out`
              Hit for 30, dragon HP: 70
              Hit for 25, dragon HP: 45
              Hit for 40, dragon HP: 5
              Hit for 10, dragon HP: 0
              The dragon is defeated!
            `,
          },
          {
            name: 'The dragon escapes',
            stdin: '3\n10 20 30',
            hidden: true,
            expected: out`
              Hit for 10, dragon HP: 90
              Hit for 20, dragon HP: 70
              Hit for 30, dragon HP: 40
              The dragon flies away with 40 HP
            `,
          },
          {
            name: 'Stops early after a huge hit',
            stdin: '5\n60 50 10 10 10',
            hidden: true,
            expected: out`
              Hit for 60, dragon HP: 40
              Hit for 50, dragon HP: 0
              The dragon is defeated!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
