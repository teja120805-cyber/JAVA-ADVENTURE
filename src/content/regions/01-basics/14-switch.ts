import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-switch',
  title: 'Switch',
  blurb: 'Pick one of many paths with switch, case and break.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Many doors, one key',
      text:
        "When you compare **one** value against lots of possibilities, `switch` is tidier than a long `else if` chain.\n\n" +
        "Java checks each `case` and runs the one that matches.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int day = 3;
            switch (day) {
              case 1:
                System.out.println("Monday");
                break;
              case 2:
                System.out.println("Tuesday");
                break;
              case 3:
                System.out.println("Wednesday");
                break;
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Why break matters',
      text:
        "`break` jumps out of the switch. Without it, Java **falls through** and keeps running the next cases too. Try removing a `break` in this example and see!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int potion = 1;
            switch (potion) {
              case 1:
                System.out.println("You feel stronger.");
                break;
              case 2:
                System.out.println("You feel faster.");
                break;
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'The default case',
      text: "`default` runs when **no** case matches, a bit like the final `else`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String weather = "fog";
            switch (weather) {
              case "sun":
                System.out.println("Perfect day for travel.");
                break;
              case "rain":
                System.out.println("Bring a cloak.");
                break;
              default:
                System.out.println("Strange weather...");
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What happens if you forget `break` at the end of a case?',
      options: [
        'Java shows a compile error',
        'The following cases run too (fall through)',
        'The switch starts again',
        'Nothing different happens',
      ],
      answer: 1,
      explain: 'Without `break`, execution falls through into the next case.',
    },
    {
      type: 'blank',
      question: 'Which keyword handles values that match no case?',
      code: 'switch (x) {\n  case 1: ... break;\n  ___: System.out.println("Other");\n}',
      answers: ['default'],
      explain: '`default` runs when no case matches.',
    },
  ],
  challenges: [
    {
      title: 'The Rune Reader',
      story:
        "Ancient runes are numbered. The program reads a rune number from the input. Use a `switch` to print its element:\n\n" +
        "- `1` → `Fire`\n- `2` → `Water`\n- `3` → `Earth`\n- `4` → `Air`\n- anything else → `Unknown rune`\n\n" +
        "Tip: type a number with the **Input** button, then Run.",
      starterCode: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int rune = scanner.nextInt();
            switch (rune) {
              case 1:
                System.out.println("Fire");
                break;
              // more cases...
            }
          }
        }
      `,
      solution: java`
        import java.util.Scanner;

        public class Main {
          public static void main(String[] args) {
            Scanner scanner = new Scanner(System.in);
            int rune = scanner.nextInt();
            switch (rune) {
              case 1:
                System.out.println("Fire");
                break;
              case 2:
                System.out.println("Water");
                break;
              case 3:
                System.out.println("Earth");
                break;
              case 4:
                System.out.println("Air");
                break;
              default:
                System.out.println("Unknown rune");
            }
          }
        }
      `,
      hints: [
        'Add case 2, case 3 and case 4, each ending with break;',
        'Finish with default: System.out.println("Unknown rune");',
      ],
      check: {
        kind: 'output',
        tests: [
          { name: 'Reads the water rune', stdin: '2', expected: 'Water' },
          { name: 'Reads another rune', stdin: '4', expected: 'Air', hidden: true },
          { name: 'Reads the first rune', stdin: '1', expected: 'Fire', hidden: true },
          { name: 'Handles a strange rune', stdin: '9', expected: 'Unknown rune', hidden: true },
        ],
      },
    },
  ],
};

export default level;
