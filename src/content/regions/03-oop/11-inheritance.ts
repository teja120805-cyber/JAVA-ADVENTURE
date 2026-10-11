import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-inheritance',
  title: 'Inheritance',
  blurb: 'Build new classes on top of existing ones with extends.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Family trees',
      text:
        "**Inheritance** lets a class take on the attributes and methods of another class.\n\n" +
        "- The class being inherited **from** is the **superclass** (parent).\n" +
        "- The class that inherits is the **subclass** (child).\n\nUse the keyword `extends`.",
    },
    {
      type: 'lesson',
      title: 'extends in action',
      text:
        "`Wolf extends Creature` means every `Wolf` automatically has everything a `Creature` has, plus anything extra it adds.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Wolf wolf = new Wolf();
            System.out.println(wolf.describe()); // inherited!
            System.out.println(wolf.howl());     // its own
          }
        }

        class Creature {
          protected String name = "Creature";
          protected int hp = 10;

          public String describe() {
            return name + " has " + hp + " HP";
          }
        }

        class Wolf extends Creature {
          public String howl() {
            return "Awooo!";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'protected: family only',
      text:
        "`protected` attributes can be used by **subclasses** (and the same package), but are hidden from unrelated classes. That lets a subclass set up its inherited values, for example in its constructor.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(new Bear().describe());
          }
        }

        class Creature {
          protected String name = "Creature";
          protected int hp = 10;

          public String describe() {
            return name + " has " + hp + " HP";
          }
        }

        class Bear extends Creature {
          public Bear() {
            name = "Bear";
            hp = 80;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Stopping inheritance with final',
      text:
        "A class marked `final` can't be extended. Java's own `String` class is final, for example. Use it when a class shouldn't be changed by subclasses.",
    },
    {
      type: 'choice',
      question: 'In `class Mage extends Hero`, which is the superclass?',
      options: ['`Mage`', '`Hero`', '`extends`', 'Both'],
      answer: 1,
      explain: '`Mage` inherits from `Hero`, so `Hero` is the superclass.',
    },
    {
      type: 'choice',
      question: 'Can a subclass use a `protected` attribute of its superclass?',
      options: ['Yes', 'No', 'Only if it is static', 'Only if it is final'],
      answer: 0,
      explain: '`protected` is designed exactly for that.',
    },
  ],
  challenges: [
    {
      title: 'Call of the Wild',
      story:
        "The `Creature` class is written for you. Below it, write a class `Wolf` that **extends** `Creature`:\n\n" +
        "- a constructor `Wolf()` that sets the inherited `name` to `\"Wolf\"` and `hp` to `30`\n" +
        "- a method `String howl()` that returns `\"Awooo!\"`\n\n" +
        "Don't change `Creature`.",
      starterCode: java`
        class Creature {
          protected String name = "Creature";
          protected int hp = 10;

          public String describe() {
            return name + " has " + hp + " HP";
          }
        }

        // write class Wolf here
      `,
      solution: java`
        class Creature {
          protected String name = "Creature";
          protected int hp = 10;

          public String describe() {
            return name + " has " + hp + " HP";
          }
        }

        class Wolf extends Creature {
          public Wolf() {
            name = "Wolf";
            hp = 30;
          }

          public String howl() {
            return "Awooo!";
          }
        }
      `,
      hints: [
        'Start with: class Wolf extends Creature { ... }',
        'The constructor public Wolf() { name = "Wolf"; hp = 30; } changes the inherited attributes.',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Wolf w = new Wolf();\nSystem.out.println(w.describe());\nSystem.out.println(w.howl());',
        tests: [
          { name: 'A wolf describes itself', code: 'System.out.println(new Wolf().describe());', expected: 'Wolf has 30 HP' },
          { name: 'A wolf howls', code: 'System.out.println(new Wolf().howl());', expected: 'Awooo!' },
          { name: 'A wolf is a Creature', code: 'Creature c = new Wolf();\nSystem.out.println(c.describe());', expected: 'Wolf has 30 HP' },
          { name: 'Plain creatures are unchanged', code: 'System.out.println(new Creature().describe());', expected: 'Creature has 10 HP' },
        ],
      },
    },
  ],
};

export default level;
