import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-variables',
  title: 'Variables',
  blurb: 'Store values in named boxes and use them later.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Boxes with labels',
      text:
        "A **variable** is a labelled box that holds a value. To make one, write its **type**, its **name**, `=`, and a value:\n\n" +
        "`int gold = 50;`\n\n" +
        "Common types: `String` (text), `int` (whole numbers), `double` (decimals), `char` (one character) and `boolean` (true/false).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String hero = "Ari";
            int gold = 50;
            double speed = 2.5;
            char grade = 'A';
            boolean hasMap = true;
            System.out.println(hero);
            System.out.println(gold);
            System.out.println(speed);
            System.out.println(grade);
            System.out.println(hasMap);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Changing a value',
      text:
        "You can put a new value in the box later. Just use the name and `=` again, **without** the type.\n\n" +
        "If you want a value that can never change, add `final` in front: `final int MAX_LEVEL = 99;`",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 50;
            gold = 75;
            System.out.println(gold);
            final int MAX_LEVEL = 99;
            System.out.println(MAX_LEVEL);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Joining text and variables',
      text:
        "Use `+` to join text and variables into one line. Java turns the number into text for you.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String name = "Ari";
            int level = 3;
            System.out.println("Hero " + name + " is level " + level);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which line correctly makes a variable holding the number 10?',
      options: ['`int score = "10";`', '`score int = 10;`', '`int score = 10;`', '`int = score 10;`'],
      answer: 2,
      explain: 'Type first, then the name, then `=` and the value: `int score = 10;`',
    },
    {
      type: 'lesson',
      title: 'Naming rules',
      text:
        "Names can contain letters, digits, `_` and `$`, but can't start with a digit or contain spaces. They're case-sensitive, and you can't use Java words like `int` or `class`.\n\n" +
        "By convention Java uses **camelCase**: `playerName`, `maxHealth`.",
    },
    {
      type: 'choice',
      question: 'Which is a valid variable name?',
      options: ['`2ndPlace`', '`my score`', '`maxHealth`', '`class`'],
      answer: 2,
      explain: '`maxHealth` follows the rules (and is nicely camelCased).',
    },
  ],
  challenges: [
    {
      title: 'Create Your Hero',
      story:
        "Time to create your hero's character sheet! Make three variables:\n\n" +
        "- a `String` called `name` holding `Ari`\n- an `int` called `level` holding `5`\n- a `double` called `health` holding `87.5`\n\n" +
        "Then use them to print exactly:\n\n```\nHero: Ari\nLevel: 5\nHealth: 87.5\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            // Create your variables here

            // Print the character sheet using the variables
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            String name = "Ari";
            int level = 5;
            double health = 87.5;
            System.out.println("Hero: " + name);
            System.out.println("Level: " + level);
            System.out.println("Health: " + health);
          }
        }
      `,
      hints: [
        'Declare each one like: String name = "Ari";',
        'Join text and a variable with +, for example: System.out.println("Hero: " + name);',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Prints the character sheet',
            expected: out`
              Hero: Ari
              Level: 5
              Health: 87.5
            `,
          },
        ],
      },
    },
  ],
};

export default level;
