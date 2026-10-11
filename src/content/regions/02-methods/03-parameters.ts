import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-parameters',
  title: 'Method Parameters',
  blurb: 'Pass information into methods and get answers back.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'Giving methods information',
      text:
        "**Parameters** are variables listed inside the method's brackets. When you call the method you pass **arguments**: the actual values.",
      code: java`
        public class Main {
          static void greet(String name) {
            System.out.println("Hello, " + name + "!");
          }

          public static void main(String[] args) {
            greet("Ari");
            greet("Brom");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'More than one parameter',
      text:
        "Separate parameters with commas. When calling, pass the arguments in the **same order** and with matching types.",
      code: java`
        public class Main {
          static void describe(String name, int level) {
            System.out.println(name + " is level " + level);
          }

          public static void main(String[] args) {
            describe("Ilsa", 7);
            describe("Brom", 3);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Returning a value',
      text:
        "Replace `void` with a type to make a method **give back** a value. Use `return` to hand the answer back to the caller, who can store or print it.",
      code: java`
        public class Main {
          static int triple(int x) {
            return x * 3;
          }

          public static void main(String[] args) {
            int result = triple(5);
            System.out.println(result);
            System.out.println(triple(10));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Returning from inside an if',
      text:
        "A method can have several `return` statements. The first one reached ends the method immediately.",
      code: java`
        public class Main {
          static String checkAge(int age) {
            if (age < 18) {
              return "Too young to join the guild.";
            }
            return "Welcome to the guild!";
          }

          public static void main(String[] args) {
            System.out.println(checkAge(12));
            System.out.println(checkAge(30));
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `add(2, 3)` return?',
      code: 'static int add(int a, int b) {\n  return a + b;\n}',
      options: ['`23`', '`5`', 'Nothing (`void`)', '`a + b`'],
      answer: 1,
      explain: 'It adds the two arguments and returns `5`.',
    },
    {
      type: 'blank',
      question: 'Complete the method so it gives back a `double`.',
      code: 'static ___ half(double x) {\n  return x / 2;\n}',
      answers: ['double'],
      explain: 'The return type goes where `void` used to be.',
    },
  ],
  challenges: [
    {
      title: 'Heal the Hero',
      story:
        "Write a method that heals the hero!\n\n" +
        "`static int heal(int hp, int amount)` should return the hero's new HP: `hp + amount`, but **never more than 100** (the maximum).\n\n" +
        "For example `heal(50, 30)` returns `80`, and `heal(90, 30)` returns `100`.",
      starterCode: java`
        static int heal(int hp, int amount) {
          // return the new HP (max 100)
          return 0;
        }
      `,
      solution: java`
        static int heal(int hp, int amount) {
          int healed = hp + amount;
          if (healed > 100) {
            return 100;
          }
          return healed;
        }
      `,
      hints: [
        'Work out hp + amount first.',
        'If the result is more than 100, return 100 instead. (Math.min(100, hp + amount) does this in one go!)',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(heal(50, 30));\nSystem.out.println(heal(90, 30));',
        tests: [
          { name: 'Heals a wounded hero', code: 'System.out.println(heal(50, 30));', expected: '80' },
          { name: 'Never goes above 100', code: 'System.out.println(heal(90, 30));', expected: '100' },
          { name: 'Healing by zero changes nothing', code: 'System.out.println(heal(42, 0));', expected: '42' },
          { name: 'Already at full health', code: 'System.out.println(heal(100, 5));', expected: '100' },
          { name: 'Heals exactly to the max', code: 'System.out.println(heal(75, 25));', expected: '100' },
        ],
      },
    },
  ],
};

export default level;
