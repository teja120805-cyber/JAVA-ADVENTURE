import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-scope',
  title: 'Scope',
  blurb: 'Where a variable lives, and where it can be seen.',
  rewards: { xp: 60, coins: 12 },
  flow: [
    {
      type: 'lesson',
      title: 'Where variables live',
      text:
        "A variable's **scope** is the part of the code where it exists and can be used. In Java, the rule of thumb is: a variable lives **inside the curly braces where it was declared**, from that line on.",
    },
    {
      type: 'lesson',
      title: 'Method scope',
      text:
        "A variable declared inside a method only exists inside that method. Another method can't see it, even if it uses the same name for its own variable.",
      code: java`
        public class Main {
          static void forest() {
            String sound = "Birds chirping";
            System.out.println(sound);
          }

          public static void main(String[] args) {
            String sound = "Waves crashing";
            forest();
            System.out.println(sound);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Block scope',
      text:
        "Any block `{ }` (an `if`, a loop, or just braces) makes its own scope. A variable declared inside it vanishes when the block ends.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int outside = 1;
            {
              int inside = 2;
              System.out.println(outside + inside);
            }
            // 'inside' doesn't exist here any more
            System.out.println(outside);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Loop variables',
      text:
        "The `i` in `for (int i = 0; ...)` only exists inside that loop. A variable declared **inside** a loop body is created fresh on **every** round, so it can't remember anything between rounds.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int total = 0; // declared OUTSIDE, so it keeps its value
            for (int i = 1; i <= 3; i++) {
              total += i;
            }
            System.out.println("Total: " + total);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Where can `x` be used?',
      code: 'public static void main(String[] args) {\n  if (true) {\n    int x = 5;\n  }\n  // here?\n}',
      options: ['Anywhere in main', 'Only inside the if block', 'Anywhere in the class', 'Only after the if block'],
      answer: 1,
      explain: '`x` was declared inside the `if` block, so it disappears at its closing brace.',
    },
    {
      type: 'choice',
      question: 'A variable is declared inside a for loop body. What happens to it each round?',
      options: ['It keeps its value', 'It is created fresh', 'It becomes global', 'It causes an error'],
      answer: 1,
      explain: 'Each round of the loop enters the block again, so the variable is created anew.',
    },
  ],
  challenges: [
    {
      title: 'The Lost Loot',
      story:
        "A goblin cursed this method! `totalLoot` should add up all the gold in the `chests` array, but it **doesn't even compile**.\n\n" +
        "Press **Run** to see the error, then fix the scope problem so `totalLoot(new int[]{1, 2, 3})` returns `6`.",
      starterCode: java`
        static int totalLoot(int[] chests) {
          for (int i = 0; i < chests.length; i++) {
            int total = 0;
            total += chests[i];
          }
          return total;
        }
      `,
      solution: java`
        static int totalLoot(int[] chests) {
          int total = 0;
          for (int i = 0; i < chests.length; i++) {
            total += chests[i];
          }
          return total;
        }
      `,
      starterHasBugs: true,
      hints: [
        'The error says Java cannot find total at the return line. Where is total declared?',
        'Move int total = 0; up, before the loop, so it lives in the whole method (and isn\'t reset each round).',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(totalLoot(new int[]{1, 2, 3}));',
        tests: [
          { name: 'Adds up three chests', code: 'System.out.println(totalLoot(new int[]{1, 2, 3}));', expected: '6' },
          { name: 'An empty dungeon', code: 'System.out.println(totalLoot(new int[]{}));', expected: '0' },
          { name: 'A rich dungeon', code: 'System.out.println(totalLoot(new int[]{100, 250, 75, 75}));', expected: '500' },
        ],
      },
    },
  ],
};

export default level;
