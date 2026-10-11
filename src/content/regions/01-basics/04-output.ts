import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-output',
  title: 'Output',
  blurb: 'Print text and numbers with println and print.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'println adds a new line',
      text:
        "`System.out.println()` prints its value and then moves to the **next line**. Call it as often as you like.\n\n" +
        "Text always goes inside double quotes. Forgetting a quote is a common bug!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Line one");
            System.out.println("Line two");
            System.out.println("Line three");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'print stays on the same line',
      text:
        "`System.out.print()` (without `ln`) prints but does **not** move to a new line. The next output continues right after it.\n\n" +
        "Remember to add spaces yourself if you want gaps between words.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.print("Sword ");
            System.out.print("and ");
            System.out.println("shield!");
            System.out.println("New line here.");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does this print?',
      code: 'System.out.print("A");\nSystem.out.print("B");\nSystem.out.println("C");',
      options: ['A, B and C on three lines', '`ABC` on one line', '`A B C`', 'Nothing, it is an error'],
      answer: 1,
      explain: '`print` does not add a new line, so all three letters end up together: `ABC`.',
    },
    {
      type: 'lesson',
      title: 'Printing numbers',
      text:
        "Numbers don't need quotes. Java can even do maths inside `println`!\n\n" +
        "Careful: `\"3 + 4\"` (with quotes) prints the text `3 + 4`, while `3 + 4` (without quotes) prints `7`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(3 + 4);
            System.out.println("3 + 4");
            System.out.println(6 * 7);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `System.out.println(10 * 3);` print?',
      options: ['`10 * 3`', '`30`', '`103`', '`"30"`'],
      answer: 1,
      explain: 'Without quotes Java calculates the result: `30`.',
    },
  ],
  challenges: [
    {
      title: "The Merchant's Receipt",
      story:
        "A travelling merchant sold you 3 potions at 5 coins each. Print the receipt exactly like this:\n\n" +
        "```\nPotions: 3 x 5 coins\nTotal: 15 coins\nThank you, traveller!\n```\n\n" +
        "Try using `print` for the start of the *Total* line and let Java calculate `3 * 5` for you.",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Potions: 3 x 5 coins");
            // Print the total line (try: print "Total: ", then the maths, then " coins")
            // Print the thank-you line
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Potions: 3 x 5 coins");
            System.out.print("Total: ");
            System.out.print(3 * 5);
            System.out.println(" coins");
            System.out.println("Thank you, traveller!");
          }
        }
      `,
      hints: [
        'System.out.print("Total: "); keeps the cursor on the same line.',
        'System.out.print(3 * 5); prints 15. Finish the line with System.out.println(" coins");',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Prints the receipt',
            expected: out`
              Potions: 3 x 5 coins
              Total: 15 coins
              Thank you, traveller!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
