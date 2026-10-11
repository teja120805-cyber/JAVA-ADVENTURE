import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-methods',
  title: 'Methods',
  blurb: 'Bundle code into reusable spells called methods.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'Welcome to the Woods',
      text:
        "Welcome to the **Whispering Method Woods**! Here you'll learn to write **methods**: named blocks of code that run when you **call** them.\n\n" +
        "Methods let you write code once and use it many times, like a spell you can cast whenever you need it.",
    },
    {
      type: 'lesson',
      title: 'Writing a method',
      text:
        "A method is written **inside the class**, next to `main`. For now our methods look like this:\n\n" +
        "`static void name() { ... }`\n\n" +
        "- `static` means it belongs to the class (so `main` can use it directly)\n- `void` means it doesn't give back a value\n- the name is followed by brackets `()`",
      code: java`
        public class Main {
          static void greet() {
            System.out.println("Well met, traveller!");
          }

          public static void main(String[] args) {
            greet();
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Calling it again and again',
      text:
        "To **call** a method, write its name followed by `()` and a semicolon. Call it as many times as you like: that's the whole point!",
      code: java`
        public class Main {
          static void chop() {
            System.out.println("Chop!");
          }

          public static void main(String[] args) {
            chop();
            chop();
            chop();
            System.out.println("The tree falls.");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Methods can do several things',
      text: "A method body can hold as many statements as you like, including loops.",
      code: java`
        public class Main {
          static void drawLine() {
            for (int i = 0; i < 10; i++) {
              System.out.print("~");
            }
            System.out.println();
          }

          public static void main(String[] args) {
            drawLine();
            System.out.println(" The Woods");
            drawLine();
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'How do you call a method named `rest`?',
      options: ['`call rest;`', '`rest;`', '`rest();`', '`void rest();`'],
      answer: 2,
      explain: 'Write the name, then brackets, then a semicolon: `rest();`',
    },
    {
      type: 'blank',
      question: "Complete the method header (it doesn't return a value).",
      code: 'static ___ sing() {',
      answers: ['void'],
      explain: '`void` means the method gives nothing back.',
    },
  ],
  challenges: [
    {
      title: 'Raise the Banner',
      story:
        "The woodland camp needs a banner. Write a method `static void drawBanner()` that prints exactly:\n\n" +
        "```\n+--------+\n|  JAVA  |\n+--------+\n```\n\n" +
        "Write **only the method**: the hidden tests will call it (sometimes more than once!).",
      starterCode: java`
        static void drawBanner() {
          // print the three lines of the banner
        }
      `,
      solution: java`
        static void drawBanner() {
          System.out.println("+--------+");
          System.out.println("|  JAVA  |");
          System.out.println("+--------+");
        }
      `,
      hints: [
        'Use three System.out.println lines inside the method.',
        'The top and bottom have 8 dashes. The middle has two spaces each side of JAVA.',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'drawBanner();',
        tests: [
          {
            name: 'Draws one banner',
            code: 'drawBanner();',
            expected: out`
              +--------+
              |  JAVA  |
              +--------+
            `,
          },
          {
            name: 'Draws two banners in a row',
            code: 'drawBanner();\ndrawBanner();',
            expected: out`
              +--------+
              |  JAVA  |
              +--------+
              +--------+
              |  JAVA  |
              +--------+
            `,
          },
        ],
      },
    },
  ],
};

export default level;
