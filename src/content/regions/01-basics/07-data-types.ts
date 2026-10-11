import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-data-types',
  title: 'Data Types',
  blurb: 'Pick the right kind of box for every value.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Two families of types',
      text:
        "Java's data types come in two families:\n\n" +
        "- **Primitive** types hold one simple value: `byte`, `short`, `int`, `long`, `float`, `double`, `boolean`, `char`.\n" +
        "- **Non-primitive** (reference) types like `String` and arrays are objects that can do things, such as `name.length()`.",
    },
    {
      type: 'lesson',
      title: 'Whole numbers',
      text:
        "`byte`, `short`, `int` and `long` hold whole numbers of different sizes. `int` is the everyday choice and goes up to about **2.1 billion**.\n\n" +
        "For bigger numbers use `long` and put an `L` at the end of the value.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            byte smallBag = 100;
            int villagers = 2500;
            long starsInSky = 7500000000L;
            System.out.println(smallBag);
            System.out.println(villagers);
            System.out.println(starsInSky);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Decimal numbers',
      text:
        "`float` and `double` hold numbers with a decimal point. `double` is more precise and is the usual choice. A `float` value needs an `f` at the end.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            double potionPrice = 4.99;
            float windSpeed = 12.5f;
            System.out.println(potionPrice);
            System.out.println(windSpeed);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Booleans and characters',
      text:
        "A `boolean` is either `true` or `false`. A `char` is a single character in **single** quotes, like `'Z'`. A `String` is text in **double** quotes.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            boolean doorLocked = true;
            char rune = 'Z';
            String spell = "Open sesame";
            System.out.println(doorLocked);
            System.out.println(rune);
            System.out.println(spell);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which type would you use to store `3000000000` (three billion)?',
      options: ['`int`', '`byte`', '`long`', '`char`'],
      answer: 2,
      explain: 'Three billion is bigger than the `int` limit (about 2.1 billion), so you need `long` (and an `L`).',
    },
    {
      type: 'choice',
      question: 'Which is a valid `char`?',
      options: ['`"A"`', "`'A'`", "`'AB'`", '`A`'],
      answer: 1,
      explain: "A `char` is exactly one character in single quotes: `'A'`.",
    },
  ],
  challenges: [
    {
      title: 'Pack the Inventory',
      story:
        "Fill your backpack! Create one variable of the **right type** for each item, then print them:\n\n" +
        "```\nArrows: 120\nGold: 3000000000\nWeight: 12.5\nRune: Z\nCursed: false\n```\n\n" +
        "Watch out: the gold pile is enormous.",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int arrows = 120;
            // gold, weight, rune, cursed...

            System.out.println("Arrows: " + arrows);
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int arrows = 120;
            long gold = 3000000000L;
            double weight = 12.5;
            char rune = 'Z';
            boolean cursed = false;
            System.out.println("Arrows: " + arrows);
            System.out.println("Gold: " + gold);
            System.out.println("Weight: " + weight);
            System.out.println("Rune: " + rune);
            System.out.println("Cursed: " + cursed);
          }
        }
      `,
      hints: [
        'Three billion is too big for an int. Use long gold = 3000000000L; (note the L).',
        "A single letter uses char with single quotes: char rune = 'Z';",
        'true/false values use boolean, decimals use double.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Prints the full inventory',
            expected: out`
              Arrows: 120
              Gold: 3000000000
              Weight: 12.5
              Rune: Z
              Cursed: false
            `,
          },
        ],
      },
    },
  ],
};

export default level;
