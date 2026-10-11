import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-arrays',
  title: 'Arrays',
  blurb: 'Store many values in one variable and loop through them.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'A row of boxes',
      text:
        "An **array** stores many values of the same type in one variable. Write the type with square brackets, and the values in curly braces:\n\n" +
        "`String[] party = {\"Ari\", \"Brom\", \"Ilsa\"};`\n\n" +
        "Get an item with its **index** in square brackets. Indexes start at **0**!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String[] party = {"Ari", "Brom", "Ilsa"};
            System.out.println(party[0]);
            System.out.println(party[2]);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Changing items and counting them',
      text:
        "Assign to an index to change an item. `array.length` tells you how many items there are (no brackets: it's not a method).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int[] scores = {10, 20, 30};
            scores[1] = 99;
            System.out.println(scores[1]);
            System.out.println("Items: " + scores.length);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Looping through arrays',
      text:
        "Use a `for` loop from `0` to `length - 1` when you need the index, or a for-each loop when you only need the values.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int[] gems = {3, 8, 1};
            for (int i = 0; i < gems.length; i++) {
              System.out.println("Bag " + i + " has " + gems[i] + " gems");
            }
            int total = 0;
            for (int g : gems) {
              total += g;
            }
            System.out.println("Total gems: " + total);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Grids: arrays of arrays',
      text:
        "A **multidimensional** array is an array of arrays, perfect for maps and boards. Use two indexes: `[row][column]`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            char[][] map = {
              {'.', '.', 'T'},
              {'.', '@', '.'}
            };
            System.out.println("Hero is at row 1, col 1: " + map[1][1]);
            for (char[] row : map) {
              for (char tile : row) {
                System.out.print(tile);
              }
              System.out.println();
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'For `int[] a = {5, 6, 7, 8};`, what is `a[a.length - 1]`?',
      options: ['`4`', '`7`', '`8`', 'An error'],
      answer: 2,
      explain: '`a.length` is 4, so `a[3]` is the last item: `8`.',
    },
    {
      type: 'blank',
      question: 'Get the number of items in the array.',
      code: 'int count = loot.___;',
      answers: ['length'],
      explain: 'Arrays have a `length` field (without brackets).',
    },
  ],
  challenges: [
    {
      title: 'Count the Gold in the Chest',
      story:
        "The `chest` array holds piles of gold coins. Loop through it to work out:\n\n" +
        "- the **total** gold\n- the **biggest** pile\n- how many **big piles** (10 coins or more) there are\n\n" +
        "Then print:\n\n```\nTotal gold: 72\nBiggest pile: 30\nBig piles: 3\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int[] chest = {12, 7, 30, 5, 18};
            int total = 0;
            int biggest = 0;
            int bigPiles = 0;
            // loop through the chest here

            System.out.println("Total gold: " + total);
            System.out.println("Biggest pile: " + biggest);
            System.out.println("Big piles: " + bigPiles);
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int[] chest = {12, 7, 30, 5, 18};
            int total = 0;
            int biggest = 0;
            int bigPiles = 0;
            for (int pile : chest) {
              total += pile;
              if (pile > biggest) {
                biggest = pile;
              }
              if (pile >= 10) {
                bigPiles++;
              }
            }
            System.out.println("Total gold: " + total);
            System.out.println("Biggest pile: " + biggest);
            System.out.println("Big piles: " + bigPiles);
          }
        }
      `,
      hints: [
        'Use for (int pile : chest) { ... } to visit every pile.',
        'Inside the loop: add to total, update biggest when pile > biggest, and count piles with pile >= 10.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Counts the gold',
            expected: out`
              Total gold: 72
              Biggest pile: 30
              Big piles: 3
            `,
          },
        ],
      },
    },
  ],
};

export default level;
