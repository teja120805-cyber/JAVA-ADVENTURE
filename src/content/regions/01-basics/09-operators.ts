import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-operators',
  title: 'Operators',
  blurb: 'Do maths, update values and compare things.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Arithmetic operators',
      text:
        "Java has the usual maths symbols: `+` add, `-` subtract, `*` multiply, `/` divide.\n\n" +
        "There's also `%` (**modulus**), which gives the **remainder** after dividing: `17 % 5` is `2`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(10 + 4);
            System.out.println(10 - 4);
            System.out.println(10 * 4);
            System.out.println(10 / 4);
            System.out.println(10 % 4);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Increment and decrement',
      text: "`x++` adds 1 to `x`, and `x--` takes 1 away. They're handy for counting.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int steps = 5;
            steps++;
            System.out.println(steps);
            steps--;
            steps--;
            System.out.println(steps);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Assignment shortcuts',
      text:
        "`x += 3` is short for `x = x + 3`. The same works for `-=`, `*=`, `/=` and `%=`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int hp = 50;
            hp += 20;  // 70
            hp -= 10;  // 60
            hp *= 2;   // 120
            System.out.println(hp);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Comparison and logic',
      text:
        "Comparison operators give `true` or `false`: `==` equal, `!=` not equal, `>`, `<`, `>=`, `<=`.\n\n" +
        "Logical operators combine them: `&&` (and), `||` (or), `!` (not).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 30;
            System.out.println(gold > 20);
            System.out.println(gold == 25);
            System.out.println(gold > 20 && gold < 50);
            System.out.println(!(gold > 20));
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What is `23 % 5`?',
      options: ['`4.6`', '`4`', '`3`', '`5`'],
      answer: 2,
      explain: '23 divided by 5 is 4 with **3** left over, and `%` gives the leftover.',
    },
    {
      type: 'choice',
      question: 'After `int x = 4; x *= 3; x++;` what is `x`?',
      options: ['`12`', '`13`', '`7`', '`8`'],
      answer: 1,
      explain: '`x *= 3` makes 12, then `x++` makes 13.',
    },
  ],
  challenges: [
    {
      title: 'Potion Math',
      story:
        "You have **17** potions and bags that hold **5** each. Your hero also has **40** HP. Using operators, print:\n\n" +
        "```\nFull bags: 3\nLeftover potions: 2\nHP: 130\n```\n\n" +
        "For HP: drink a potion (`+= 25`), then a magic doubling spell (`*= 2`).",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int potions = 17;
            int bagSize = 5;
            int hp = 40;
            // Work out full bags and leftovers

            // Update hp with += and *=

          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int potions = 17;
            int bagSize = 5;
            int hp = 40;
            System.out.println("Full bags: " + potions / bagSize);
            System.out.println("Leftover potions: " + potions % bagSize);
            hp += 25;
            hp *= 2;
            System.out.println("HP: " + hp);
          }
        }
      `,
      hints: [
        'potions / bagSize gives the number of full bags (whole-number division).',
        'potions % bagSize gives the leftovers.',
        '(40 + 25) * 2 = 130. Use hp += 25; then hp *= 2;',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Does the potion maths',
            expected: out`
              Full bags: 3
              Leftover potions: 2
              HP: 130
            `,
          },
        ],
      },
    },
  ],
};

export default level;
