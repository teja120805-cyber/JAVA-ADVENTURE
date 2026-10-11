import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-overloading',
  title: 'Method Overloading',
  blurb: 'Give several methods the same name with different parameters.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'Same name, different inputs',
      text:
        "**Overloading** means writing several methods with the **same name** but **different parameters** (a different number of them, or different types).\n\n" +
        "Java picks the right one by looking at the arguments you pass.",
      code: java`
        public class Main {
          static int add(int a, int b) {
            return a + b;
          }

          static double add(double a, double b) {
            return a + b;
          }

          public static void main(String[] args) {
            System.out.println(add(2, 3));
            System.out.println(add(2.5, 1.25));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Different number of parameters',
      text: "Overloads can also differ in **how many** parameters they take. This is a nice way to offer optional extras.",
      code: java`
        public class Main {
          static void shout(String word) {
            System.out.println(word + "!");
          }

          static void shout(String word, int times) {
            for (int i = 0; i < times; i++) {
              System.out.print(word + "! ");
            }
            System.out.println();
          }

          public static void main(String[] args) {
            shout("Charge");
            shout("Hey", 3);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: "What doesn't count",
      text:
        "Changing **only** the return type isn't enough. Java decides which method to call from the arguments, so two methods with identical parameters would be ambiguous and won't compile.",
    },
    {
      type: 'choice',
      question: 'Which pair is a valid overload?',
      options: [
        '`int f(int x)` and `double f(int x)`',
        '`int f(int x)` and `int f(int y)`',
        '`int f(int x)` and `int f(int x, int y)`',
        '`int f(int x)` and `int g(int x)`',
      ],
      answer: 2,
      explain: 'Overloads need the same name with different parameter lists. Only the return type or parameter name is not enough.',
    },
  ],
  challenges: [
    {
      title: 'Many Ways to Strike',
      story:
        "Write **three** overloaded `damage` methods:\n\n" +
        "- `static int damage(int base)` returns `base`\n" +
        "- `static int damage(int base, int multiplier)` returns `base * multiplier`\n" +
        "- `static double damage(double base, double bonus)` returns `base + bonus`",
      starterCode: java`
        static int damage(int base) {
          return base;
        }

        static int damage(int base, int multiplier) {
          // return base times multiplier
          return 0;
        }

        // write the third damage method (two doubles, returns a double) here
      `,
      solution: java`
        static int damage(int base) {
          return base;
        }

        static int damage(int base, int multiplier) {
          return base * multiplier;
        }

        static double damage(double base, double bonus) {
          return base + bonus;
        }
      `,
      hints: [
        'All three are called damage. Only the parameters (and return type) differ.',
        'The double version: static double damage(double base, double bonus) { return base + bonus; }',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(damage(10));\nSystem.out.println(damage(10, 3));\n// Once you have written it, try: System.out.println(damage(2.5, 1.5));',
        tests: [
          { name: 'A basic strike', code: 'System.out.println(damage(10));', expected: '10' },
          { name: 'A multiplied strike', code: 'System.out.println(damage(10, 3));', expected: '30' },
          { name: 'A strike with a decimal bonus', code: 'System.out.println(damage(2.5, 1.5));', expected: '4.0' },
          { name: 'All three together', code: 'System.out.println(damage(7) + damage(2, 4));\nSystem.out.println(damage(0.5, 0.25));', expected: '15\n0.75' },
        ],
      },
    },
  ],
};

export default level;
