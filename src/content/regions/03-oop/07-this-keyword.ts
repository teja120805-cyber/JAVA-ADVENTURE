import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-this',
  title: 'this Keyword',
  blurb: 'Refer to the current object, and chain constructors.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Who am I?',
      text:
        "Inside a class, `this` means **the current object**: the one whose method or constructor is running right now.",
    },
    {
      type: 'lesson',
      title: 'Same names, no confusion',
      text:
        "It's common to give constructor parameters the **same names** as the attributes. Then `name` alone means the parameter, and `this.name` means the object's attribute.\n\n" +
        "Without `this`, the line `name = name;` would just copy the parameter onto itself, and the attribute would stay empty!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Spell s = new Spell("Frost", 40);
            System.out.println(s.name + " has power " + s.power);
          }
        }

        class Spell {
          String name;
          int power;

          Spell(String name, int power) {
            this.name = name;
            this.power = power;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Calling another constructor',
      text:
        "`this(...)` calls **another constructor** of the same class. It's handy for default values. It must be the **first line** of the constructor.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Spell weak = new Spell("Spark");
            System.out.println(weak.name + " has power " + weak.power);
          }
        }

        class Spell {
          String name;
          int power;

          Spell(String name, int power) {
            this.name = name;
            this.power = power;
          }

          Spell(String name) {
            this(name, 10); // default power
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'In `this.power = power;` inside a constructor, what is `this.power`?',
      options: ['The parameter', 'The object\'s attribute', 'A static variable', 'A new local variable'],
      answer: 1,
      explain: '`this.power` is the attribute; plain `power` is the parameter.',
    },
    {
      type: 'blank',
      question: 'Call the two-parameter constructor with a default power of 10.',
      code: 'Spell(String name) {\n  ___(name, 10);\n}',
      answers: ['this'],
      explain: '`this(name, 10)` calls the other constructor.',
    },
  ],
  challenges: [
    {
      title: 'The Spellbook',
      story:
        "Write a class `Spell` with attributes `String name` and `int power`.\n\n" +
        "- `Spell(String name, int power)`: stores both, using `this`\n" +
        "- `Spell(String name)`: uses `this(...)` to create a spell with power `10`\n" +
        "- `void boost(int power)`: **adds** the parameter to the spell's power\n" +
        "- `String describe()`: returns e.g. `Frost (power 40)`",
      starterCode: java`
        class Spell {
          String name;
          int power;

          Spell(String name, int power) {
            // store the parameters in the attributes
          }

          // Spell(String name), boost(int power), describe()
        }
      `,
      solution: java`
        class Spell {
          String name;
          int power;

          Spell(String name, int power) {
            this.name = name;
            this.power = power;
          }

          Spell(String name) {
            this(name, 10);
          }

          void boost(int power) {
            this.power += power;
          }

          String describe() {
            return name + " (power " + power + ")";
          }
        }
      `,
      hints: [
        'this.name = name; and this.power = power;',
        'The one-parameter constructor is just: this(name, 10);',
        'In boost, the parameter hides the attribute, so write this.power += power;',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Spell s = new Spell("Frost", 40);\ns.boost(5);\nSystem.out.println(s.describe());',
        tests: [
          { name: 'A full spell', code: 'System.out.println(new Spell("Frost", 40).describe());', expected: 'Frost (power 40)' },
          { name: 'A spell with default power', code: 'System.out.println(new Spell("Spark").describe());', expected: 'Spark (power 10)' },
          {
            name: 'Boosting a spell',
            code: 'Spell s = new Spell("Gust", 20);\ns.boost(15);\ns.boost(5);\nSystem.out.println(s.describe());',
            expected: 'Gust (power 40)',
          },
          {
            name: 'Attributes are really stored',
            code: 'Spell s = new Spell("Quake", 99);\nSystem.out.println(s.name + " " + s.power);',
            expected: 'Quake 99',
          },
        ],
      },
    },
  ],
};

export default level;
