import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-class-challenge',
  title: 'Class Challenge',
  blurb: 'Practise: a class with attributes and methods that work together.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Putting it together',
      text:
        "A useful class combines **attributes** (what it knows) with **methods** (what it can do). The methods usually read and update the attributes.",
    },
    {
      type: 'lesson',
      title: 'Methods with parameters',
      text: "Object methods can take parameters and return values, just like the static methods you wrote in the Woods.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Purse purse = new Purse();
            purse.add(30);
            purse.add(12);
            System.out.println(purse.describe());
          }
        }

        class Purse {
          int coins = 0;

          void add(int amount) {
            coins += amount;
          }

          String describe() {
            return "The purse holds " + coins + " coins.";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Guarding against mistakes',
      text:
        "Methods can **check** before changing things. Here `spend` refuses to let the purse go below zero.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Purse purse = new Purse();
            purse.spend(5);
            System.out.println(purse.coins);
          }
        }

        class Purse {
          int coins = 3;

          void spend(int amount) {
            if (amount > coins) {
              System.out.println("Not enough coins!");
            } else {
              coins -= amount;
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Inside an object method, what does `coins += amount;` change?',
      options: ['Every Purse object', 'Only this object\'s coins', 'A static variable', 'Nothing'],
      answer: 1,
      explain: 'Object methods work on the attributes of the object they were called on.',
    },
  ],
  challenges: [
    {
      title: 'The Adventurer\'s Pack',
      story:
        "Write a class `Inventory` with:\n\n" +
        "- `int potions` and `int arrows`, both starting at `0`\n" +
        "- `void addPotions(int n)`: adds `n` potions\n" +
        "- `void addArrows(int n)`: adds `n` arrows\n" +
        "- `void shoot()`: uses one arrow, but if there are none, prints `Out of arrows!` instead\n" +
        "- `String report()`: returns e.g. `Potions: 2, Arrows: 5`",
      starterCode: java`
        class Inventory {
          int potions = 0;
          int arrows = 0;

          // addPotions, addArrows, shoot, report
        }
      `,
      solution: java`
        class Inventory {
          int potions = 0;
          int arrows = 0;

          void addPotions(int n) {
            potions += n;
          }

          void addArrows(int n) {
            arrows += n;
          }

          void shoot() {
            if (arrows > 0) {
              arrows--;
            } else {
              System.out.println("Out of arrows!");
            }
          }

          String report() {
            return "Potions: " + potions + ", Arrows: " + arrows;
          }
        }
      `,
      hints: [
        'addPotions(int n) is just potions += n; and addArrows works the same way.',
        'shoot(): if (arrows > 0) arrows--; else print "Out of arrows!".',
        'report() returns "Potions: " + potions + ", Arrows: " + arrows',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Inventory pack = new Inventory();\npack.addPotions(2);\npack.addArrows(5);\npack.shoot();\nSystem.out.println(pack.report());',
        tests: [
          { name: 'An empty pack', code: 'System.out.println(new Inventory().report());', expected: 'Potions: 0, Arrows: 0' },
          {
            name: 'Packing supplies',
            code: 'Inventory p = new Inventory();\np.addPotions(2);\np.addArrows(5);\np.addArrows(3);\nSystem.out.println(p.report());',
            expected: 'Potions: 2, Arrows: 8',
          },
          {
            name: 'Shooting uses arrows',
            code: 'Inventory p = new Inventory();\np.addArrows(2);\np.shoot();\nSystem.out.println(p.report());',
            expected: 'Potions: 0, Arrows: 1',
          },
          {
            name: 'Running out of arrows',
            code: 'Inventory p = new Inventory();\np.addArrows(1);\np.shoot();\np.shoot();\nSystem.out.println(p.report());',
            expected: 'Out of arrows!\nPotions: 0, Arrows: 0',
          },
        ],
      },
    },
  ],
};

export default level;
