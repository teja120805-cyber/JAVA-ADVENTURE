import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-challenge',
  title: 'Method Challenge',
  blurb: 'Practise: methods that call other methods.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'Quick recap',
      text:
        "A method is a named block of code. You **define** it once (`static void name() { ... }`) and **call** it with `name();` wherever you need it.",
    },
    {
      type: 'lesson',
      title: 'Methods calling methods',
      text:
        "Methods can call **other** methods. This lets you build big actions out of small, simple ones, like building a castle from bricks.",
      code: java`
        public class Main {
          static void openGate() {
            System.out.println("The gate opens.");
          }

          static void lowerBridge() {
            System.out.println("The bridge lowers.");
          }

          static void welcomeKnight() {
            openGate();
            lowerBridge();
            System.out.println("Welcome, Sir Knight!");
          }

          public static void main(String[] args) {
            welcomeKnight();
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Order matters inside, not outside',
      text:
        "The order you **write** methods in the class doesn't matter. Java finds them anyway. What matters is the order you **call** them in.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            second();
            first();
          }

          static void first() {
            System.out.println("I was written first.");
          }

          static void second() {
            System.out.println("I was written second.");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What is printed when `main` calls `b()`?',
      code: 'static void a() { System.out.println("A"); }\nstatic void b() { a(); System.out.println("B"); a(); }',
      options: ['`B`', '`A B`', '`A`, `B`, `A` on three lines', '`B`, `A`, `A` on three lines'],
      answer: 2,
      explain: '`b` calls `a` (A), prints B, then calls `a` again (A).',
    },
  ],
  challenges: [
    {
      title: 'Morning at Camp',
      story:
        "Write **three** methods:\n\n" +
        "- `stretch()` prints `Stretching...`\n- `eatBreakfast()` prints `Eating bread and cheese`\n" +
        "- `morningRoutine()` calls `stretch()`, then `eatBreakfast()`, then prints `Ready for adventure!`\n\n" +
        "All three are `static void` methods.",
      starterCode: java`
        static void stretch() {
          // print Stretching...
        }

        static void eatBreakfast() {
          // print Eating bread and cheese
        }

        static void morningRoutine() {
          // call the other two methods, then print Ready for adventure!
        }
      `,
      solution: java`
        static void stretch() {
          System.out.println("Stretching...");
        }

        static void eatBreakfast() {
          System.out.println("Eating bread and cheese");
        }

        static void morningRoutine() {
          stretch();
          eatBreakfast();
          System.out.println("Ready for adventure!");
        }
      `,
      hints: [
        'Each method looks like: static void name() { ... }',
        'morningRoutine() should contain stretch(); and eatBreakfast(); before its own println.',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'morningRoutine();',
        tests: [
          { name: 'stretch() works on its own', code: 'stretch();', expected: 'Stretching...' },
          { name: 'eatBreakfast() works on its own', code: 'eatBreakfast();', expected: 'Eating bread and cheese' },
          {
            name: 'morningRoutine() does everything in order',
            code: 'morningRoutine();',
            expected: out`
              Stretching...
              Eating bread and cheese
              Ready for adventure!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
