import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-type-casting',
  title: 'Type Casting',
  blurb: 'Convert values from one type to another.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Changing types',
      text:
        "**Type casting** means turning a value of one type into another, for example an `int` into a `double`.\n\n" +
        "There are two directions: **widening** (small type to bigger type) and **narrowing** (big type to smaller type).",
    },
    {
      type: 'lesson',
      title: 'Widening happens by itself',
      text:
        "Putting a smaller type into a bigger one is always safe, so Java does it automatically: `byte` → `short` → `int` → `long` → `float` → `double`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int coins = 9;
            double asDouble = coins; // automatic
            System.out.println(coins);
            System.out.println(asDouble);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Narrowing needs a cast',
      text:
        "Going from a bigger type to a smaller one might lose information, so you must ask for it by writing the type in brackets: `(int) 9.78`.\n\n" +
        "Casting a decimal to `int` simply **chops off** everything after the point. It does not round!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            double price = 9.78;
            int whole = (int) price; // manual cast
            System.out.println(price);
            System.out.println(whole);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Dividing whole numbers',
      text:
        "When both sides of `/` are `int`, Java does **whole-number division**: `7 / 2` is `3`.\n\n" +
        "To get the exact answer, cast one side to `double` first: `(double) 7 / 2` is `3.5`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int apples = 7;
            int friends = 2;
            System.out.println(apples / friends);
            System.out.println((double) apples / friends);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What is the value of `(int) 4.99`?',
      options: ['`5`', '`4`', '`4.99`', 'It is an error'],
      answer: 1,
      explain: 'Casting to `int` drops the decimal part, so `4.99` becomes `4`.',
    },
    {
      type: 'blank',
      question: 'Cast `total` so the division keeps its decimals.',
      code: 'double avg = (___) total / count;',
      answers: ['double'],
      explain: 'Casting one side to `double` makes Java use decimal division.',
    },
  ],
  challenges: [
    {
      title: 'Split the Treasure',
      story:
        "Four heroes found **158** gold coins. Using the variables `coins` and `heroes`, print:\n\n" +
        "```\nExact share: 39.5\nEach hero gets: 39\nCoins left over: 2\n```\n\n" +
        "Use a cast to `double` for the exact share, normal `int` division for the whole coins, and `%` (remainder) for what's left over.",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int coins = 158;
            int heroes = 4;
            // Print the exact share, each hero's whole coins, and the leftovers
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int coins = 158;
            int heroes = 4;
            double exact = (double) coins / heroes;
            int each = coins / heroes;
            int left = coins % heroes;
            System.out.println("Exact share: " + exact);
            System.out.println("Each hero gets: " + each);
            System.out.println("Coins left over: " + left);
          }
        }
      `,
      hints: [
        '(double) coins / heroes gives 39.5.',
        'coins / heroes with two ints gives 39, and coins % heroes gives the remainder 2.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Splits the treasure',
            expected: out`
              Exact share: 39.5
              Each hero gets: 39
              Coins left over: 2
            `,
          },
        ],
      },
    },
  ],
};

export default level;
