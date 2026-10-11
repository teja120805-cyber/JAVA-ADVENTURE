import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-syntax',
  title: 'Syntax',
  blurb: 'Learn the grammar of Java: classes, braces and semicolons.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'The shape of every program',
      text:
        "Every Java program has the same outer shape: a **class**, and inside it a **main method**.\n\n" +
        "`public class Main` names the class. `public static void main(String[] args)` is the door Java walks through to start your program.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Every journey starts in main.");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Curly braces are walls',
      text:
        "Curly braces `{ }` mark where a block of code starts and ends. The class has a pair, and the main method has its own pair *inside* it.\n\n" +
        "Every `{` needs a matching `}`. Indenting the code inside each pair makes it much easier to spot a missing one.",
    },
    {
      type: 'lesson',
      title: 'Semicolons end statements',
      text:
        "Each instruction (a **statement**) ends with a semicolon `;`. It's like a full stop at the end of a sentence.\n\n" +
        "Forget one, and the compiler will stop and tell you `';' expected`, along with the line number.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("First statement;");
            System.out.println("Second statement!");
          }
        }
      `,
    },
    {
      type: 'blank',
      question: 'Complete the main method header.',
      code: 'public ___ void main(String[] args) {',
      answers: ['static'],
      explain: 'The full header is `public static void main(String[] args)`.',
    },
    {
      type: 'lesson',
      title: 'Java is case-sensitive',
      text:
        "`System` and `system` are completely different words to Java. Built-in names like `System` and `String` start with a capital letter.\n\n" +
        "If you see `package system does not exist` or `cannot find symbol`, check your capital letters first.",
    },
    {
      type: 'choice',
      question: 'Which line is written correctly?',
      options: [
        '`system.out.println("Hi");`',
        '`System.out.println("Hi")`',
        '`System.out.println("Hi");`',
        '`System.Out.Println("Hi");`',
      ],
      answer: 2,
      explain: 'Capital `S` in `System`, lowercase `out` and `println`, and a semicolon at the end.',
    },
  ],
  challenges: [
    {
      title: 'Repair the Bridge',
      story:
        "A rickety bridge blocks your path. Its spell has **three** syntax mistakes. Fix them so the program compiles and prints:\n\n" +
        "```\nThe bridge is repaired!\nOnward!\n```\n\n" +
        "Press **Run** first and read the compiler's error messages: they point at the lines to fix.",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            system.out.println("The bridge is repaired!")
            System.out.println("Onward!");

        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("The bridge is repaired!");
            System.out.println("Onward!");
          }
        }
      `,
      starterHasBugs: true,
      hints: [
        'One statement is missing its semicolon at the end.',
        'Java is case-sensitive: is it system or System?',
        'Count the curly braces. Every { needs a matching }.',
      ],
      check: {
        kind: 'output',
        tests: [{ name: 'Bridge is repaired', expected: out`
          The bridge is repaired!
          Onward!
        ` }],
      },
    },
  ],
};

export default level;
