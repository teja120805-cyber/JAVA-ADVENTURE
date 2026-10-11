import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-classes-objects',
  title: 'Classes/Objects',
  blurb: 'Create classes and build objects from them.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Creating a class',
      text:
        "Use the keyword `class` followed by a name. Class names start with a **capital letter** by convention: `Chest`, `Dragon`, `Hero`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Chest chest = new Chest();
            System.out.println("This chest holds " + chest.gold + " gold.");
          }
        }

        class Chest {
          int gold = 25;
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Creating objects',
      text:
        "To make an object: the class name (as the type), a variable name, `=`, then `new` and the class name with brackets:\n\n" +
        "`Chest chest = new Chest();`",
    },
    {
      type: 'lesson',
      title: 'Many objects, one class',
      text:
        "You can build as many objects from a class as you like. Each has its **own copy** of the attributes, so changing one doesn't affect the others.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Chest small = new Chest();
            Chest big = new Chest();
            big.gold = 500;
            System.out.println(small.gold);
            System.out.println(big.gold);
          }
        }

        class Chest {
          int gold = 25;
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Classes in their own files',
      text:
        "In bigger projects each class usually gets its **own file** (`Chest.java`, `Main.java`) in the same folder, and they can use each other freely.\n\n" +
        "Here in the game we keep everything in one file, which works just as well for learning.",
    },
    {
      type: 'blank',
      question: 'Create a new `Dragon` object.',
      code: 'Dragon smaug = ___ Dragon();',
      answers: ['new'],
      explain: '`new` builds a fresh object from the class.',
    },
    {
      type: 'choice',
      question: 'Two `Chest` objects are created and you set the first one\'s `gold` to 0. What happens to the second?',
      options: ['Its gold also becomes 0', 'Nothing, it keeps its own gold', 'It is deleted', 'Java shows an error'],
      answer: 1,
      explain: 'Every object has its own copy of the attributes.',
    },
  ],
  challenges: [
    {
      title: 'The Three Chests',
      story:
        "Below `Main`, write a class `Chest` with an `int` attribute `gold` that starts at `25`.\n\n" +
        "Then in `main`: create **three** chests, change the **second** chest's gold to `100`, and print the total of all three:\n\n" +
        "```\nTotal gold: 150\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            // create three chests, change the second one, print the total
          }
        }

        // write the Chest class here
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            Chest first = new Chest();
            Chest second = new Chest();
            Chest third = new Chest();
            second.gold = 100;
            int total = first.gold + second.gold + third.gold;
            System.out.println("Total gold: " + total);
          }
        }

        class Chest {
          int gold = 25;
        }
      `,
      hints: [
        'The class: class Chest { int gold = 25; }',
        'Make three objects with new Chest(), then set second.gold = 100;',
        'Total: first.gold + second.gold + third.gold',
      ],
      check: {
        kind: 'output',
        tests: [{ name: 'Counts the gold in three chests', expected: 'Total gold: 150' }],
      },
    },
  ],
};

export default level;
