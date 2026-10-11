import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-recursion',
  title: 'Recursion',
  blurb: 'Methods that call themselves, and how to make them stop.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'A method that calls itself',
      text:
        "**Recursion** is when a method calls **itself** to solve a smaller version of the same problem. It's like a hall of mirrors: each reflection is a little smaller than the last.",
      code: java`
        public class Main {
          static void countdown(int n) {
            if (n == 0) {
              System.out.println("Go!");
              return;
            }
            System.out.println(n);
            countdown(n - 1);
          }

          public static void main(String[] args) {
            countdown(3);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'The base case',
      text:
        "Every recursive method needs a **base case** (also called a halting condition): a situation where it stops calling itself. Without one it calls itself forever and crashes with a `StackOverflowError`.\n\n" +
        "Each call must also move **closer** to the base case, for example `n - 1`.",
    },
    {
      type: 'lesson',
      title: 'Recursion that returns',
      text:
        "Recursive methods often **return** a value built from the smaller answer. Here `sum(5)` is `5 + sum(4)`, which is `4 + sum(3)`, all the way down to `sum(0)`, which is `0`.",
      code: java`
        public class Main {
          static int sum(int n) {
            if (n == 0) {
              return 0;          // base case
            }
            return n + sum(n - 1); // smaller problem
          }

          public static void main(String[] args) {
            System.out.println(sum(5));
            System.out.println(sum(100));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Factorial',
      text:
        "The factorial of `n` (written `n!`) is `n × (n-1) × ... × 1`. It's a classic recursion: `n! = n × (n-1)!`, and `1! = 1`.",
      code: java`
        public class Main {
          static long factorial(int n) {
            if (n <= 1) {
              return 1;
            }
            return n * factorial(n - 1);
          }

          public static void main(String[] args) {
            System.out.println(factorial(5));
            System.out.println(factorial(10));
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What happens if a recursive method has no base case?',
      options: ['It returns 0', 'It runs once', 'It calls itself until the program crashes', 'Java adds one automatically'],
      answer: 2,
      explain: 'It never stops calling itself, and eventually Java throws a `StackOverflowError`.',
    },
    {
      type: 'choice',
      question: 'Using the `sum` method above, what is `sum(3)`?',
      options: ['`3`', '`5`', '`6`', '`9`'],
      answer: 2,
      explain: '3 + 2 + 1 + 0 = **6**.',
    },
  ],
  challenges: [
    {
      title: 'The Magic Mirror',
      story:
        "A magic mirror **doubles** any gold reflected in it. Each extra reflection doubles it again.\n\n" +
        "Write a **recursive** method `static long mirror(long gold, int reflections)`:\n\n" +
        "- with `0` reflections, the gold is unchanged\n- otherwise, it's double the result of one fewer reflection\n\n" +
        "So `mirror(3, 2)` is `12` (3 → 6 → 12).",
      starterCode: java`
        static long mirror(long gold, int reflections) {
          // base case: no reflections left

          // otherwise: double the answer for (reflections - 1)
          return 0;
        }
      `,
      solution: java`
        static long mirror(long gold, int reflections) {
          if (reflections == 0) {
            return gold;
          }
          return 2 * mirror(gold, reflections - 1);
        }
      `,
      hints: [
        'Base case: if (reflections == 0) return gold;',
        'Recursive case: return 2 * mirror(gold, reflections - 1);',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(mirror(3, 2));',
        tests: [
          { name: 'No reflections', code: 'System.out.println(mirror(7, 0));', expected: '7' },
          { name: 'Two reflections', code: 'System.out.println(mirror(3, 2));', expected: '12' },
          { name: 'Ten reflections', code: 'System.out.println(mirror(5, 10));', expected: '5120' },
          { name: 'A really big fortune', code: 'System.out.println(mirror(1, 40));', expected: '1099511627776' },
        ],
      },
    },
  ],
};

export default level;
