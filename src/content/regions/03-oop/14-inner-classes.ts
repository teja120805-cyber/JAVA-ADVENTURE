import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-inner-classes',
  title: 'Inner Classes',
  blurb: 'Classes inside classes: inner, private and static nested.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'A class inside a class',
      text:
        "Java lets you put a class **inside** another class. This groups classes that belong together and keeps helpers out of the way.\n\n" +
        "To create an **inner** object you first need an outer object: `outer.new Inner()`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Castle castle = new Castle();
            Castle.Tower tower = castle.new Tower();
            System.out.println(tower.height);
          }
        }

        class Castle {
          class Tower {
            int height = 30;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Inner classes see the outer object',
      text:
        "An inner class can use the attributes and methods of its outer object, even `private` ones. Every inner object is tied to the outer object that created it.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Castle home = new Castle("Javahold");
            Castle.Tower tower = home.new Tower();
            System.out.println(tower.whereAmI());
          }
        }

        class Castle {
          private String name;

          Castle(String name) {
            this.name = name;
          }

          class Tower {
            String whereAmI() {
              return "A tower of " + name;
            }
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Static nested classes',
      text:
        "Mark the inner class `static` and it no longer needs an outer object: `new Castle.Gate()`. In return, it can't use the outer object's attributes.\n\n" +
        "You can also make an inner class `private` to hide it from the outside world completely.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Castle.Gate gate = new Castle.Gate();
            System.out.println(gate.open());
          }
        }

        class Castle {
          static class Gate {
            String open() {
              return "The gate creaks open.";
            }
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'How do you create a (non-static) inner `Tower` object?',
      options: ['`new Tower()`', '`new Castle.Tower()`', '`castle.new Tower()`', '`Castle.Tower()`'],
      answer: 2,
      explain: 'Inner objects belong to an outer object: `castle.new Tower()`.',
    },
    {
      type: 'choice',
      question: 'What can a `static` nested class NOT do?',
      options: [
        'Have methods',
        "Use the outer object's attributes",
        'Be created with new',
        'Have attributes',
      ],
      answer: 1,
      explain: 'A static nested class has no outer object, so it cannot reach its attributes.',
    },
  ],
  challenges: [
    {
      title: 'Build the Castle',
      story:
        "Write a class `Castle` with a private `String name` set by the constructor `Castle(String name)`. Inside it put:\n\n" +
        "- an **inner** class `Tower` with an `int height` set by `Tower(int height)`, and a method `String describe()` returning e.g. `A 30m tower of Javahold`\n" +
        "- a **static nested** class `Gate` with a method `String open()` returning `The gate creaks open.`",
      starterCode: java`
        class Castle {
          private String name;

          Castle(String name) {
            this.name = name;
          }

          // inner class Tower

          // static nested class Gate
        }
      `,
      solution: java`
        class Castle {
          private String name;

          Castle(String name) {
            this.name = name;
          }

          class Tower {
            int height;

            Tower(int height) {
              this.height = height;
            }

            String describe() {
              return "A " + height + "m tower of " + name;
            }
          }

          static class Gate {
            String open() {
              return "The gate creaks open.";
            }
          }
        }
      `,
      hints: [
        'Inside Castle: class Tower { int height; Tower(int height) { this.height = height; } ... }',
        'Tower.describe() can use name directly: it belongs to the outer Castle.',
        'static class Gate { String open() { return "The gate creaks open."; } }',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Castle c = new Castle("Javahold");\nCastle.Tower t = c.new Tower(30);\nSystem.out.println(t.describe());',
        tests: [
          {
            name: 'A tower knows its castle',
            code: 'Castle c = new Castle("Javahold");\nCastle.Tower t = c.new Tower(30);\nSystem.out.println(t.describe());',
            expected: 'A 30m tower of Javahold',
          },
          {
            name: 'Two castles, two towers',
            code: 'Castle a = new Castle("Northwatch");\nCastle b = new Castle("Sunspire");\nSystem.out.println(a.new Tower(12).describe());\nSystem.out.println(b.new Tower(45).describe());',
            expected: 'A 12m tower of Northwatch\nA 45m tower of Sunspire',
          },
          { name: 'The gate needs no castle object', code: 'System.out.println(new Castle.Gate().open());', expected: 'The gate creaks open.' },
        ],
      },
    },
  ],
};

export default level;
