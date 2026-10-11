import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-constructors',
  title: 'Constructors',
  blurb: 'Set up each new object with its own starting values.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'The object\'s birth ceremony',
      text:
        "A **constructor** is a special method that runs **automatically** when you create an object with `new`. It's the place to set starting values.\n\n" +
        "It has the **same name as the class** and **no return type** (not even `void`).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Pet pet = new Pet();
            System.out.println(pet.name);
          }
        }

        class Pet {
          String name;

          Pet() {
            System.out.println("A new pet hatches!");
            name = "Pebble";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Constructors with parameters',
      text:
        "Constructors can take parameters, so every object can start out different. Pass the values inside the brackets after `new`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Pet a = new Pet("Pebble");
            Pet b = new Pet("Biscuit");
            System.out.println(a.name + " and " + b.name);
          }
        }

        class Pet {
          String name;

          Pet(String petName) {
            name = petName;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'As many parameters as you need',
      text: "Add more parameters, separated by commas. The arguments must come in the same order.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Pet p = new Pet("Ember", "dragon", 3);
            System.out.println(p.name + " the " + p.species + " is " + p.age);
          }
        }

        class Pet {
          String name;
          String species;
          int age;

          Pet(String petName, String petSpecies, int petAge) {
            name = petName;
            species = petSpecies;
            age = petAge;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'The invisible constructor',
      text:
        "Every class has a constructor. If you don't write one, Java quietly adds an empty one with no parameters. But as soon as you write your **own**, that free one disappears.",
    },
    {
      type: 'choice',
      question: 'Which is a valid constructor for class `Knight`?',
      options: ['`void Knight() { }`', '`Knight() { }`', '`knight() { }`', '`int Knight() { }`'],
      answer: 1,
      explain: 'Same name as the class, and no return type at all.',
    },
    {
      type: 'blank',
      question: 'Create a `Pet` named Biscuit using the constructor.',
      code: 'Pet p = new Pet(___);',
      answers: ['"Biscuit"'],
      explain: 'Pass the name as a String argument: `new Pet("Biscuit")`.',
    },
  ],
  challenges: [
    {
      title: 'Hatch a Companion',
      story:
        "Write a class `Pet` with attributes `String name`, `String species` and `int age`.\n\n" +
        "- Give it a constructor `Pet(String petName, String petSpecies, int petAge)` that stores all three.\n" +
        "- Add a method `String describe()` that returns e.g. `Ember the dragon (age 3)`.",
      starterCode: java`
        class Pet {
          String name;
          String species;
          int age;

          // constructor

          // describe()
        }
      `,
      solution: java`
        class Pet {
          String name;
          String species;
          int age;

          Pet(String petName, String petSpecies, int petAge) {
            name = petName;
            species = petSpecies;
            age = petAge;
          }

          String describe() {
            return name + " the " + species + " (age " + age + ")";
          }
        }
      `,
      hints: [
        'The constructor is: Pet(String petName, String petSpecies, int petAge) { ... } with no return type.',
        'Inside it: name = petName; species = petSpecies; age = petAge;',
        'describe() returns name + " the " + species + " (age " + age + ")"',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Pet p = new Pet("Ember", "dragon", 3);\nSystem.out.println(p.describe());',
        tests: [
          { name: 'Hatches a dragon', code: 'System.out.println(new Pet("Ember", "dragon", 3).describe());', expected: 'Ember the dragon (age 3)' },
          {
            name: 'Stores every attribute',
            code: 'Pet p = new Pet("Biscuit", "griffin", 12);\nSystem.out.println(p.name + "|" + p.species + "|" + p.age);',
            expected: 'Biscuit|griffin|12',
          },
          {
            name: 'Two different pets',
            code: 'Pet a = new Pet("Moss", "toad", 1);\nPet b = new Pet("Nova", "phoenix", 500);\nSystem.out.println(a.describe());\nSystem.out.println(b.describe());',
            expected: 'Moss the toad (age 1)\nNova the phoenix (age 500)',
          },
        ],
      },
    },
  ],
};

export default level;
