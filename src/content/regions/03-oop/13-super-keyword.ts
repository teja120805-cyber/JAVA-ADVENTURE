import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-super',
  title: 'super Keyword',
  blurb: 'Reach up to the parent class: its constructor and its methods.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Talking to your parent',
      text:
        "`super` refers to the **superclass** (parent). You use it to call the parent's **constructor** or the parent's version of a **method**.",
    },
    {
      type: 'lesson',
      title: 'Calling the parent constructor',
      text:
        "If the parent's constructor needs arguments, the child must pass them with `super(...)`. It must be the **first line** of the child's constructor.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Warrior w = new Warrior("Brom");
            System.out.println(w.name + " has " + w.hp + " HP");
          }
        }

        class Character {
          protected String name;
          protected int hp;

          public Character(String name, int hp) {
            this.name = name;
            this.hp = hp;
          }
        }

        class Warrior extends Character {
          public Warrior(String name) {
            super(name, 120); // warriors are tough
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: "Extending the parent's method",
      text:
        "When you override a method, you can still run the parent's version with `super.methodName()` and then **add** to it, instead of rewriting everything.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(new Knight().greet());
          }
        }

        class Hero {
          public String greet() {
            return "Hello!";
          }
        }

        class Knight extends Hero {
          @Override
          public String greet() {
            return super.greet() + " I am a knight of the realm.";
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Where must `super(...)` go inside a constructor?',
      options: ['Anywhere', 'The last line', 'The first line', 'Outside the constructor'],
      answer: 2,
      explain: 'The parent must be built first, so `super(...)` is always the first statement.',
    },
    {
      type: 'blank',
      question: "Call the parent's `describe()` method from an overriding method.",
      code: 'return ___.describe() + " (armoured)";',
      answers: ['super'],
      explain: '`super.describe()` runs the superclass version.',
    },
  ],
  challenges: [
    {
      title: 'Forge a Warrior',
      story:
        "The `Character` class is given. Write `class Warrior extends Character` with:\n\n" +
        "- a private `int armor` attribute\n" +
        "- a constructor `Warrior(String name, int armor)` that calls `super(name, 120)` and stores the armor\n" +
        "- an overridden `describe()` that returns the parent's description followed by ` with N armor`\n\n" +
        "For example: `Brom (120 HP) with 8 armor`",
      starterCode: java`
        class Character {
          protected String name;
          protected int hp;

          public Character(String name, int hp) {
            this.name = name;
            this.hp = hp;
          }

          public String describe() {
            return name + " (" + hp + " HP)";
          }
        }

        class Warrior extends Character {
          // armor, constructor, describe()
        }
      `,
      starterHasBugs: true,
      solution: java`
        class Character {
          protected String name;
          protected int hp;

          public Character(String name, int hp) {
            this.name = name;
            this.hp = hp;
          }

          public String describe() {
            return name + " (" + hp + " HP)";
          }
        }

        class Warrior extends Character {
          private int armor;

          public Warrior(String name, int armor) {
            super(name, 120);
            this.armor = armor;
          }

          @Override
          public String describe() {
            return super.describe() + " with " + armor + " armor";
          }
        }
      `,
      hints: [
        'The constructor starts with super(name, 120); then this.armor = armor;',
        'describe() returns super.describe() + " with " + armor + " armor"',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Warrior w = new Warrior("Brom", 8);\nSystem.out.println(w.describe());',
        tests: [
          { name: 'A warrior describes itself', code: 'System.out.println(new Warrior("Brom", 8).describe());', expected: 'Brom (120 HP) with 8 armor' },
          { name: 'Warriors get 120 HP', code: 'Warrior w = new Warrior("Tess", 3);\nSystem.out.println(w.hp);', expected: '120' },
          { name: 'Works through the parent type', code: 'Character c = new Warrior("Ulf", 15);\nSystem.out.println(c.describe());', expected: 'Ulf (120 HP) with 15 armor' },
          { name: 'Plain characters are unchanged', code: 'System.out.println(new Character("Pip", 40).describe());', expected: 'Pip (40 HP)' },
        ],
      },
    },
  ],
};

export default level;
