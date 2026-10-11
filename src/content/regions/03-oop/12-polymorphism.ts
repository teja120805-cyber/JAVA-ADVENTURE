import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-polymorphism',
  title: 'Polymorphism',
  blurb: 'One method call, many behaviours: overriding in subclasses.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Many forms',
      text:
        "**Polymorphism** means \"many forms\". When subclasses **override** (replace) a method from their superclass, the same call does different things depending on the actual object.",
    },
    {
      type: 'lesson',
      title: 'Overriding a method',
      text:
        "To override, write a method in the subclass with the **same name and parameters**. The `@Override` note is optional, but it asks Java to check you got the name right.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Animal a = new Animal();
            Animal c = new Cat();
            System.out.println(a.sound());
            System.out.println(c.sound());
          }
        }

        class Animal {
          public String sound() {
            return "...";
          }
        }

        class Cat extends Animal {
          @Override
          public String sound() {
            return "Meow";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'One list, many types',
      text:
        "Because a `Cat` **is an** `Animal`, you can keep different subclasses in one `Animal[]` array. Each object still uses **its own** version of the method.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Animal[] zoo = { new Cat(), new Owl(), new Animal() };
            for (Animal animal : zoo) {
              System.out.println(animal.sound());
            }
          }
        }

        class Animal {
          public String sound() {
            return "...";
          }
        }

        class Cat extends Animal {
          @Override
          public String sound() {
            return "Meow";
          }
        }

        class Owl extends Animal {
          @Override
          public String sound() {
            return "Hoo hoo";
          }
        }
      `,
    },
    {
      type: 'choice',
      question: '`Animal pet = new Cat();` then `pet.sound()`. Whose `sound()` runs?',
      options: ["Animal's", "Cat's", 'Both', "Neither, it's an error"],
      answer: 1,
      explain: 'Java uses the method of the **actual object**, which is a `Cat`.',
    },
    {
      type: 'blank',
      question: 'Which annotation asks Java to check that you really are overriding a method?',
      code: '@___\npublic String sound() { ... }',
      answers: ['Override'],
      explain: '`@Override` gives a compile error if no superclass method matches.',
    },
  ],
  challenges: [
    {
      title: 'Assemble the Party',
      story:
        "The `Hero` class is given. Write three subclasses that **override** `attack()`:\n\n" +
        "- `Knight` returns `The knight swings a sword!`\n" +
        "- `Archer` returns `The archer fires an arrow!`\n" +
        "- `Mage` returns `The mage casts a fireball!`",
      starterCode: java`
        class Hero {
          public String attack() {
            return "The hero attacks!";
          }
        }

        class Knight extends Hero {
          // override attack()
        }

        // Archer and Mage
      `,
      solution: java`
        class Hero {
          public String attack() {
            return "The hero attacks!";
          }
        }

        class Knight extends Hero {
          @Override
          public String attack() {
            return "The knight swings a sword!";
          }
        }

        class Archer extends Hero {
          @Override
          public String attack() {
            return "The archer fires an arrow!";
          }
        }

        class Mage extends Hero {
          @Override
          public String attack() {
            return "The mage casts a fireball!";
          }
        }
      `,
      hints: [
        'Each subclass has the same method header as Hero: public String attack()',
        'class Archer extends Hero { @Override public String attack() { return "The archer fires an arrow!"; } }',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Hero[] party = { new Knight(), new Hero() };\nfor (Hero h : party) {\n  System.out.println(h.attack());\n}',
        tests: [
          { name: 'The knight attacks', code: 'System.out.println(new Knight().attack());', expected: 'The knight swings a sword!' },
          { name: 'The archer attacks', code: 'Hero h = new Archer();\nSystem.out.println(h.attack());', expected: 'The archer fires an arrow!' },
          { name: 'The mage attacks', code: 'Hero h = new Mage();\nSystem.out.println(h.attack());', expected: 'The mage casts a fireball!' },
          {
            name: 'The whole party in one array',
            code: 'Hero[] party = { new Knight(), new Archer(), new Mage(), new Hero() };\nfor (Hero h : party) {\n  System.out.println(h.attack());\n}',
            expected: out`
              The knight swings a sword!
              The archer fires an arrow!
              The mage casts a fireball!
              The hero attacks!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
