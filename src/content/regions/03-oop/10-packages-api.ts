import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-packages',
  title: 'Packages / API',
  blurb: "Import ready-made classes from Java's huge library.",
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Folders for classes',
      text:
        "A **package** is a group of related classes, a bit like a folder. Java comes with thousands of ready-made classes organised in packages, called the **Java API**.\n\n" +
        "For example `java.util` holds helpers like `Scanner`, `ArrayList` and `Arrays`.",
    },
    {
      type: 'lesson',
      title: 'Importing one class',
      text:
        "To use a class from another package, `import` it at the **very top** of the file, before the class:\n\n" +
        "`import java.util.Arrays;`\n\n" +
        "`Arrays.sort(...)` sorts an array, and `Arrays.toString(...)` turns it into readable text.",
      code: java`
        import java.util.Arrays;

        public class Main {
          public static void main(String[] args) {
            int[] levels = {7, 2, 9, 4};
            Arrays.sort(levels);
            System.out.println(Arrays.toString(levels));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Importing a whole package',
      text:
        "Use `*` to import **every** class in a package: `import java.util.*;`\n\n" +
        "Classes in `java.lang` (like `String`, `Math` and `System`) are imported automatically, which is why you never had to import them.",
      code: java`
        import java.util.*;

        public class Main {
          public static void main(String[] args) {
            ArrayList<String> party = new ArrayList<>();
            party.add("Ari");
            party.add("Brom");
            System.out.println(party + " (" + party.size() + " heroes)");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Your own packages',
      text:
        "You can make your own packages too. Put `package mygame;` as the first line of a file, and save it in a folder called `mygame`. Other files can then `import mygame.Hero;`.\n\n" +
        "In this game every program lives in one file, so we won't need our own packages, but you'll see them in every real project.",
    },
    {
      type: 'choice',
      question: 'Which class do you NOT need to import?',
      options: ['`java.util.Scanner`', '`java.util.Arrays`', '`java.lang.Math`', '`java.util.ArrayList`'],
      answer: 2,
      explain: 'Everything in `java.lang` (like `Math` and `String`) is imported automatically.',
    },
    {
      type: 'blank',
      question: 'Import every class in the `java.util` package.',
      code: 'import java.util.___;',
      answers: ['*'],
      explain: 'The `*` wildcard imports the whole package.',
    },
  ],
  challenges: [
    {
      title: 'Sort the Loot',
      story:
        "Your loot is a mess! The program below uses `Arrays`, but it **won't compile** yet. Add the missing import, then finish `main` so it prints:\n\n" +
        "```\nSorted: [3, 7, 19, 42, 88]\nHighest: 88\nLowest: 3\n```",
      starterCode: java`
        // add the import here

        public class Main {
          public static void main(String[] args) {
            int[] loot = {42, 7, 19, 88, 3};
            Arrays.sort(loot);
            System.out.println("Sorted: " + Arrays.toString(loot));
            // after sorting, where are the highest and lowest values?
          }
        }
      `,
      starterHasBugs: true,
      solution: java`
        import java.util.Arrays;

        public class Main {
          public static void main(String[] args) {
            int[] loot = {42, 7, 19, 88, 3};
            Arrays.sort(loot);
            System.out.println("Sorted: " + Arrays.toString(loot));
            System.out.println("Highest: " + loot[loot.length - 1]);
            System.out.println("Lowest: " + loot[0]);
          }
        }
      `,
      hints: [
        'The first line should be: import java.util.Arrays;',
        'After sorting, the lowest is loot[0] and the highest is loot[loot.length - 1].',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Sorts the loot',
            expected: out`
              Sorted: [3, 7, 19, 42, 88]
              Highest: 88
              Lowest: 3
            `,
          },
        ],
      },
    },
  ],
};

export default level;
