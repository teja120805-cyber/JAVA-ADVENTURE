import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-intro',
  title: 'OOP',
  blurb: 'Object-Oriented Programming: thinking in blueprints and things.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Welcome to the Castle',
      text:
        "You've reached the **Castle of Objects**! Here you'll learn **Object-Oriented Programming** (OOP), the way most big Java programs are built.\n\n" +
        "So far, you wrote **procedures**: steps that work on data. OOP bundles the **data** and the **actions** that belong together into **objects**.",
    },
    {
      type: 'lesson',
      title: 'Classes and objects',
      text:
        "A **class** is a blueprint. An **object** is a real thing built from that blueprint.\n\n" +
        "Think of `Potion` as the recipe, and the three potions on your shelf as objects. Each one follows the same recipe, but each is its own thing: drinking one doesn't empty the others.",
    },
    {
      type: 'lesson',
      title: 'Your first class',
      text:
        "Here's a tiny `Potion` class with one **attribute** (a variable that belongs to it). In `main`, `new Potion()` builds an object from the blueprint, and the dot `.` reaches inside it.\n\n" +
        "(We put `Main` first in the file, because Java starts with the first class it finds.)",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Potion myPotion = new Potion();
            System.out.println("My potion is " + myPotion.color);
          }
        }

        class Potion {
          String color = "red";
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Why bother?',
      text:
        "OOP keeps code **organised** (everything about potions lives in `Potion`), makes it **reusable** (build as many objects as you need), and follows the **DRY** principle: *Don't Repeat Yourself*.",
    },
    {
      type: 'choice',
      question: 'In OOP, what is a class?',
      options: ['A single object', 'A blueprint for creating objects', 'A type of loop', 'A Java file'],
      answer: 1,
      explain: 'A class is the blueprint; objects are built from it with `new`.',
    },
    {
      type: 'choice',
      question: 'If `Dragon` is a class, which of these is an object?',
      options: ['`class Dragon`', '`new Dragon()`', '`Dragon.java`', '`void Dragon`'],
      answer: 1,
      explain: '`new Dragon()` creates a new object from the `Dragon` class.',
    },
  ],
  challenges: [
    {
      title: 'Brew a Potion',
      story:
        "Write a class called `Potion` with a `String` attribute named `color` that starts as `\"red\"`.\n\n" +
        "The hidden tests will brew several potions and check that each one is its own object. Write **only the class**: no `Main` needed.",
      starterCode: java`
        class Potion {
          // add a String attribute called color, set to "red"
        }
      `,
      solution: java`
        class Potion {
          String color = "red";
        }
      `,
      hints: ['Inside the class, declare a variable: String color = "red";'],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Potion p = new Potion();\nSystem.out.println("Brewed a " + p.color + " potion");',
        tests: [
          { name: 'A new potion is red', code: 'Potion p = new Potion();\nSystem.out.println(p.color);', expected: 'red' },
          {
            name: 'Each potion is its own object',
            code: 'Potion a = new Potion();\nPotion b = new Potion();\nb.color = "blue";\nSystem.out.println(a.color + " " + b.color);',
            expected: 'red blue',
          },
        ],
      },
    },
  ],
};

export default level;
