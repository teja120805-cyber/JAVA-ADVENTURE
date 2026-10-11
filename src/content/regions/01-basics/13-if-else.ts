import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-if-else',
  title: 'If...Else',
  blurb: 'Make decisions: run code only when a condition is true.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'If this, then that',
      text:
        "`if` runs a block of code **only when** its condition is `true`. The condition goes in round brackets, the code in curly braces.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 40;
            if (gold > 20) {
              System.out.println("You can buy the shield!");
            }
            System.out.println("Done shopping.");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Otherwise: else',
      text: "`else` gives a second path that runs when the condition is `false`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int hour = 22;
            if (hour < 18) {
              System.out.println("Good day, traveller.");
            } else {
              System.out.println("Good evening, traveller.");
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'More choices: else if',
      text:
        "Chain extra checks with `else if`. Java tests them **top to bottom** and runs only the **first** one that's true.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int score = 72;
            if (score >= 90) {
              System.out.println("Legendary!");
            } else if (score >= 60) {
              System.out.println("Well done!");
            } else {
              System.out.println("Keep training.");
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'The short version',
      text:
        "The **ternary operator** squeezes a simple if/else into one line:\n\n`condition ? valueIfTrue : valueIfFalse`",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int hp = 15;
            String mood = (hp < 20) ? "Scared" : "Brave";
            System.out.println(mood);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'With `int x = 50;`, what does this print?',
      code: 'if (x > 80) {\n  System.out.println("A");\n} else if (x > 40) {\n  System.out.println("B");\n} else if (x > 10) {\n  System.out.println("C");\n}',
      options: ['A', 'B', 'C', 'B and C'],
      answer: 1,
      explain: 'Java stops at the first true condition: `x > 40`, so only **B** is printed.',
    },
    {
      type: 'blank',
      question: 'Complete the ternary operator.',
      code: 'String door = locked ___ "Closed" : "Open";',
      answers: ['?'],
      explain: 'The ternary operator is `condition ? a : b`.',
    },
  ],
  challenges: [
    {
      title: "The Healer's Diagnosis",
      story:
        "The village healer checks heroes as they arrive. The program **reads** a hero's HP from the keyboard (that part is done for you, using a `Scanner`).\n\n" +
        "Print:\n\n- `Critical!` if HP is **below 20**\n- `Wounded` if HP is **below 60**\n- `Healthy` otherwise\n\n" +
        "Use the **Input** button above the editor to type a number before you press Run. Submit tests several different heroes.",
      starterCode: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int hp = scanner.nextInt();
            // Print Critical!, Wounded or Healthy
          }
        }
      `,
      solution: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int hp = scanner.nextInt();
            if (hp < 20) {
              System.out.println("Critical!");
            } else if (hp < 60) {
              System.out.println("Wounded");
            } else {
              System.out.println("Healthy");
            }
          }
        }
      `,
      hints: [
        'Use if / else if / else with three branches.',
        'Check the smallest range first: if (hp < 20) ... else if (hp < 60) ... else ...',
        'A hero with exactly 20 HP is Wounded, and exactly 60 is Healthy.',
      ],
      check: {
        kind: 'output',
        tests: [
          { name: 'A badly hurt hero', stdin: '15', expected: 'Critical!' },
          { name: 'A hero with medium HP', stdin: '45', expected: 'Wounded', hidden: true },
          { name: 'A hero at full health', stdin: '100', expected: 'Healthy', hidden: true },
          { name: 'Exactly on the edge', stdin: '20', expected: 'Wounded', hidden: true },
          { name: 'Exactly on the other edge', stdin: '60', expected: 'Healthy', hidden: true },
        ],
      },
    },
  ],
};

export default level;
