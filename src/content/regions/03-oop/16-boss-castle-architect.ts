import { java } from '../../helpers';
import type { Level } from '../../types';

const characterBase = java`
  abstract class Character {
    protected String name;
    protected int hp;

    public Character(String name, int hp) {
      this.name = name;
      this.hp = hp;
    }

    public abstract int attackPower();

    public String getName() {
      return name;
    }

    public int getHp() {
      return hp;
    }

    public void takeDamage(int amount) {
      hp = Math.max(0, hp - amount);
    }

    public boolean isAlive() {
      return hp > 0;
    }
  }
`;

const level: Level = {
  id: 'oop-boss',
  title: 'The Castle Architect',
  blurb: 'Boss battle! Design an RPG class hierarchy and make it fight.',
  boss: true,
  rewards: { xp: 220, coins: 60 },
  flow: [
    {
      type: 'lesson',
      title: 'The final gate',
      text:
        "At the top of the castle waits the **Architect**, who will only let you pass if you can design a proper class hierarchy.\n\n" +
        "You'll build an RPG system: an abstract `Character`, with `Warrior` and `Mage` subclasses, and then make them **battle**.",
    },
    {
      type: 'lesson',
      title: 'Planning the hierarchy',
      text:
        "Good designs put **shared** things in the parent and **different** things in the children:\n\n" +
        "- `Character` (abstract): name, hp, taking damage, being alive, and an abstract `attackPower()`\n" +
        "- `Warrior`: 120 HP, steady attack of 15\n- `Mage`: 80 HP, powerful attack of 25",
    },
    {
      type: 'lesson',
      title: 'Objects working together',
      text:
        "Methods can take **other objects** as parameters. An attack is one character changing another character's HP.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Slime a = new Slime();
            Slime b = new Slime();
            a.bump(b);
            System.out.println("b has " + b.hp + " HP");
          }
        }

        class Slime {
          int hp = 10;

          void bump(Slime other) {
            other.hp -= 3;
          }
        }
      `,
    },
    {
      type: 'choice',
      question: '`Character` is abstract. Which line compiles?',
      options: ['`Character c = new Character("X", 10);`', '`Character c = new Warrior("Brom");`', '`Warrior w = new Character("Brom", 120);`', 'None of them'],
      answer: 1,
      explain: 'A `Warrior` is a `Character`, so a Character variable can hold one. Abstract classes cannot be created with `new`.',
    },
    {
      type: 'choice',
      question: 'Where should `takeDamage` be written?',
      options: ['In Warrior and in Mage', 'In Character only', 'In Main', 'It must be abstract'],
      answer: 1,
      explain: 'It works the same for everyone, so write it once in the parent and let both subclasses inherit it (DRY!).',
    },
  ],
  challenges: [
    {
      title: 'Trial 1: Raise the Heroes',
      story:
        "The abstract `Character` class is given. Write two subclasses:\n\n" +
        "- `Warrior`: constructor `Warrior(String name)` that gives **120** HP; `attackPower()` returns **15**\n" +
        "- `Mage`: constructor `Mage(String name)` that gives **80** HP; `attackPower()` returns **25**\n\n" +
        "Use `super(...)` in the constructors.",
      starterCode: characterBase + '\n\n' + java`
        class Warrior extends Character {
          public Warrior(String name) {
            super(name, 120);
          }

          // attackPower()
        }

        // class Mage
      `,
      starterHasBugs: true,
      solution: characterBase + '\n\n' + java`
        class Warrior extends Character {
          public Warrior(String name) {
            super(name, 120);
          }

          @Override
          public int attackPower() {
            return 15;
          }
        }

        class Mage extends Character {
          public Mage(String name) {
            super(name, 80);
          }

          @Override
          public int attackPower() {
            return 25;
          }
        }
      `,
      hints: [
        'Both subclasses must implement public int attackPower(), because it is abstract in Character.',
        'Mage looks just like Warrior, with 80 HP and power 25.',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Character w = new Warrior("Brom");\nCharacter m = new Mage("Ilsa");\nSystem.out.println(w.getName() + ": " + w.getHp() + " HP, power " + w.attackPower());\nSystem.out.println(m.getName() + ": " + m.getHp() + " HP, power " + m.attackPower());',
        tests: [
          {
            name: 'A warrior is ready',
            code: 'Character w = new Warrior("Brom");\nSystem.out.println(w.getName() + " " + w.getHp() + " " + w.attackPower());',
            expected: 'Brom 120 15',
          },
          {
            name: 'A mage is ready',
            code: 'Character m = new Mage("Ilsa");\nSystem.out.println(m.getName() + " " + m.getHp() + " " + m.attackPower());',
            expected: 'Ilsa 80 25',
          },
          {
            name: 'Heroes can be hurt and fall',
            code: 'Character m = new Mage("Ilsa");\nm.takeDamage(30);\nSystem.out.println(m.getHp() + " " + m.isAlive());\nm.takeDamage(100);\nSystem.out.println(m.getHp() + " " + m.isAlive());',
            expected: '50 true\n0 false',
          },
          {
            name: 'They are both Characters',
            code: 'Character[] party = { new Warrior("A"), new Mage("B") };\nint total = 0;\nfor (Character c : party) total += c.attackPower();\nSystem.out.println(total);',
            expected: '40',
          },
        ],
      },
    },
    {
      title: 'Trial 2: Battle in the Courtyard',
      story:
        "Now make them fight! Add to `Character` a method `String attack(Character target)` that:\n\n" +
        "1. works out the power **once** with `attackPower()`\n2. deals that damage to the target\n" +
        "3. returns e.g. `Brom hits Ilsa for 15! Ilsa has 65 HP left.`\n\n" +
        "The mage has a twist: give `Mage` a private `int mana` starting at **2**. Each `attackPower()` call uses 1 mana and returns **25**; with no mana left it returns just **5** (a feeble staff bonk).",
      starterCode: java`
        abstract class Character {
          protected String name;
          protected int hp;

          public Character(String name, int hp) {
            this.name = name;
            this.hp = hp;
          }

          public abstract int attackPower();

          public String attack(Character target) {
            // 1. power, 2. damage the target, 3. return the message
            return "";
          }

          public String getName() {
            return name;
          }

          public int getHp() {
            return hp;
          }

          public void takeDamage(int amount) {
            hp = Math.max(0, hp - amount);
          }

          public boolean isAlive() {
            return hp > 0;
          }
        }

        class Warrior extends Character {
          public Warrior(String name) {
            super(name, 120);
          }

          @Override
          public int attackPower() {
            return 15;
          }
        }

        class Mage extends Character {
          // mana

          public Mage(String name) {
            super(name, 80);
          }

          @Override
          public int attackPower() {
            return 25;
          }
        }
      `,
      solution: java`
        abstract class Character {
          protected String name;
          protected int hp;

          public Character(String name, int hp) {
            this.name = name;
            this.hp = hp;
          }

          public abstract int attackPower();

          public String attack(Character target) {
            int power = attackPower();
            target.takeDamage(power);
            return name + " hits " + target.getName() + " for " + power + "! "
                + target.getName() + " has " + target.getHp() + " HP left.";
          }

          public String getName() {
            return name;
          }

          public int getHp() {
            return hp;
          }

          public void takeDamage(int amount) {
            hp = Math.max(0, hp - amount);
          }

          public boolean isAlive() {
            return hp > 0;
          }
        }

        class Warrior extends Character {
          public Warrior(String name) {
            super(name, 120);
          }

          @Override
          public int attackPower() {
            return 15;
          }
        }

        class Mage extends Character {
          private int mana = 2;

          public Mage(String name) {
            super(name, 80);
          }

          @Override
          public int attackPower() {
            if (mana > 0) {
              mana--;
              return 25;
            }
            return 5;
          }
        }
      `,
      hints: [
        'In attack: int power = attackPower(); target.takeDamage(power); then build the message using power (don\'t call attackPower() again!).',
        'The message: name + " hits " + target.getName() + " for " + power + "! " + target.getName() + " has " + target.getHp() + " HP left."',
        'In Mage: private int mana = 2; and attackPower() checks if (mana > 0) { mana--; return 25; } else return 5.',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Warrior w = new Warrior("Brom");\nMage m = new Mage("Ilsa");\nSystem.out.println(w.attack(m));\nSystem.out.println(m.attack(w));',
        tests: [
          {
            name: 'The warrior strikes',
            code: 'Warrior w = new Warrior("Brom");\nMage m = new Mage("Ilsa");\nSystem.out.println(w.attack(m));',
            expected: 'Brom hits Ilsa for 15! Ilsa has 65 HP left.',
          },
          {
            name: 'The mage runs out of mana',
            code: 'Warrior w = new Warrior("Brom");\nMage m = new Mage("Ilsa");\nSystem.out.println(m.attack(w));\nSystem.out.println(m.attack(w));\nSystem.out.println(m.attack(w));',
            expected:
              'Ilsa hits Brom for 25! Brom has 95 HP left.\nIlsa hits Brom for 25! Brom has 70 HP left.\nIlsa hits Brom for 5! Brom has 65 HP left.',
          },
          {
            name: 'A battle to the end',
            code:
              'Warrior w = new Warrior("Brom");\nMage m = new Mage("Ilsa");\nint rounds = 0;\nwhile (w.isAlive() && m.isAlive()) {\n  w.attack(m);\n  if (m.isAlive()) m.attack(w);\n  rounds++;\n}\nSystem.out.println((w.isAlive() ? w.getName() : m.getName()) + " wins after " + rounds + " rounds with " + (w.isAlive() ? w.getHp() : m.getHp()) + " HP");',
            expected: 'Brom wins after 6 rounds with 55 HP',
          },
          {
            name: 'Each mage has its own mana',
            code: 'Mage a = new Mage("A");\nMage b = new Mage("B");\na.attackPower();\na.attackPower();\nSystem.out.println(a.attackPower() + " " + b.attackPower());',
            expected: '5 25',
          },
        ],
      },
    },
  ],
};

export default level;
