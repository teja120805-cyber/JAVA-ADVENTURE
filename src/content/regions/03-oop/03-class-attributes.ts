import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-class-attributes',
  title: 'Class Attributes',
  blurb: 'Give objects their own data, and protect values with final.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Attributes are variables in a class',
      text:
        "Variables declared inside a class (but outside any method) are called **attributes** (or *fields*). They describe the object: a hero's name, level, health...",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            System.out.println(hero.name + " is level " + hero.level);
          }
        }

        class Hero {
          String name = "Ari";
          int level = 1;
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Reading and changing attributes',
      text: "Use the dot to read an attribute, and `=` to change it, just like a normal variable.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            hero.level = 5;
            hero.name = "Ari the Bold";
            System.out.println(hero.name + " is level " + hero.level);
          }
        }

        class Hero {
          String name = "Ari";
          int level = 1;
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Locking a value with final',
      text:
        "Mark an attribute `final` if it should **never** change. Trying to change it is a compile error, which protects you from mistakes.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            System.out.println("Max level: " + hero.maxLevel);
            // hero.maxLevel = 100;  // try uncommenting this line!
          }
        }

        class Hero {
          final int maxLevel = 50;
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Starting values',
      text:
        "If you don't give an attribute a starting value, Java picks a default: `0` for numbers, `false` for booleans, and `null` (nothing) for objects like `String`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            System.out.println(hero.gold);
            System.out.println(hero.cursed);
            System.out.println(hero.title);
          }
        }

        class Hero {
          int gold;
          boolean cursed;
          String title;
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `final` do to an attribute?',
      options: ['Makes it the last attribute', 'Stops its value from being changed', 'Makes it private', 'Deletes it'],
      answer: 1,
      explain: 'A `final` attribute keeps its value forever.',
    },
    {
      type: 'choice',
      question: 'What is the default value of an `int` attribute with no starting value?',
      options: ['`null`', '`1`', '`0`', 'It is an error'],
      answer: 2,
      explain: 'Number attributes start at `0`.',
    },
  ],
  challenges: [
    {
      title: 'The Character Sheet',
      story:
        "Write a class `Hero` with these attributes:\n\n" +
        "- `String name`, starting as `\"Ari\"`\n- `int level`, starting at `1`\n- `int gold`, with **no** starting value (so it's 0)\n" +
        "- `final int maxLevel` set to `50`\n\nThe tests will read and change them.",
      starterCode: java`
        class Hero {
          String name = "Ari";
          // level, gold and maxLevel...
        }
      `,
      solution: java`
        class Hero {
          String name = "Ari";
          int level = 1;
          int gold;
          final int maxLevel = 50;
        }
      `,
      hints: [
        'int level = 1;  and  int gold;  (no value needed)',
        'final int maxLevel = 50;',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Hero h = new Hero();\nSystem.out.println(h.name + " lvl " + h.level + ", gold " + h.gold + ", max " + h.maxLevel);',
        tests: [
          { name: 'A new hero', code: 'Hero h = new Hero();\nSystem.out.println(h.name + " " + h.level + " " + h.gold);', expected: 'Ari 1 0' },
          { name: 'The level cap', code: 'System.out.println(new Hero().maxLevel);', expected: '50' },
          {
            name: 'Levelling up one hero leaves others alone',
            code: 'Hero a = new Hero();\nHero b = new Hero();\na.level = 7;\na.gold += 30;\nSystem.out.println(a.level + " " + a.gold + " / " + b.level + " " + b.gold);',
            expected: '7 30 / 1 0',
          },
        ],
      },
    },
  ],
};

export default level;
