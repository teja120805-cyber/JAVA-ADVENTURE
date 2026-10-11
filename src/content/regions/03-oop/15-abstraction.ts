import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-abstraction',
  title: 'Abstraction',
  blurb: 'Abstract classes and methods: show what, hide how.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Show what, hide how',
      text:
        "**Abstraction** means showing only the important parts and hiding the details. A player casts a spell without knowing how each spell works inside.",
    },
    {
      type: 'lesson',
      title: 'Abstract classes',
      text:
        "An `abstract` class is an **unfinished blueprint**: you can't create objects from it directly with `new`. It exists to be **extended**.\n\n" +
        "It can still have normal attributes and methods that subclasses inherit.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            // Spell s = new Spell(); // error: Spell is abstract
            Spell s = new Spark();
            System.out.println(s.school());
          }
        }

        abstract class Spell {
          String school() {
            return "School of Magic";
          }
        }

        class Spark extends Spell {
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Abstract methods',
      text:
        "An `abstract` method has **no body**, just a header ending in `;`. It says \"every subclass **must** provide this\". A subclass that doesn't is a compile error (unless it's abstract too).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Spell[] book = { new Fireball(), new Heal() };
            for (Spell s : book) {
              System.out.println(s.cast());
            }
          }
        }

        abstract class Spell {
          abstract String effect();

          String cast() {
            return "You cast a spell: " + effect();
          }
        }

        class Fireball extends Spell {
          String effect() {
            return "flames burst!";
          }
        }

        class Heal extends Spell {
          String effect() {
            return "wounds close.";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Why use it?',
      text:
        "The abstract class holds the **shared** logic (like `cast()`), while each subclass fills in only its **unique** part. Code that uses `Spell` works with any spell, even ones invented later.",
    },
    {
      type: 'choice',
      question: 'What happens if you write `new Spell()` when `Spell` is abstract?',
      options: ['It creates an empty spell', 'A compile error', 'It creates a Fireball', 'It returns null'],
      answer: 1,
      explain: 'Abstract classes cannot be instantiated.',
    },
    {
      type: 'choice',
      question: 'Which is a correct abstract method?',
      options: ['`abstract int cost() { }`', '`abstract int cost();`', '`int abstract cost;`', '`abstract cost();`'],
      answer: 1,
      explain: 'Abstract methods have a return type, a name, brackets, and end with `;` (no body).',
    },
  ],
  challenges: [
    {
      title: 'The Spellbook of Abstraction',
      story:
        "Write an **abstract** class `Spell` with:\n\n" +
        "- abstract methods `int manaCost()` and `String effect()`\n" +
        "- a normal method `String cast()` returning the effect followed by ` (-N mana)`, e.g. `Fireball explodes (-30 mana)`\n\n" +
        "Then write two subclasses:\n\n" +
        "- `Fireball`: costs `30`, effect `Fireball explodes`\n- `Heal`: costs `15`, effect `Wounds close`",
      starterCode: java`
        abstract class Spell {
          // two abstract methods

          String cast() {
            return "";
          }
        }

        // class Fireball, class Heal
      `,
      solution: java`
        abstract class Spell {
          abstract int manaCost();

          abstract String effect();

          String cast() {
            return effect() + " (-" + manaCost() + " mana)";
          }
        }

        class Fireball extends Spell {
          int manaCost() {
            return 30;
          }

          String effect() {
            return "Fireball explodes";
          }
        }

        class Heal extends Spell {
          int manaCost() {
            return 15;
          }

          String effect() {
            return "Wounds close";
          }
        }
      `,
      hints: [
        'Abstract methods look like: abstract int manaCost();',
        'cast() can call effect() and manaCost(): Java runs the subclass versions.',
        'Each subclass: class Heal extends Spell { int manaCost() { return 15; } String effect() { return "Wounds close"; } }',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Spell s = new Fireball();\nSystem.out.println(s.cast());',
        tests: [
          { name: 'Casting a fireball', code: 'System.out.println(new Fireball().cast());', expected: 'Fireball explodes (-30 mana)' },
          { name: 'Casting a heal', code: 'Spell s = new Heal();\nSystem.out.println(s.cast());', expected: 'Wounds close (-15 mana)' },
          {
            name: 'Spell is abstract',
            code: 'System.out.println(java.lang.reflect.Modifier.isAbstract(Spell.class.getModifiers()));',
            expected: 'true',
          },
          {
            name: 'manaCost and effect are abstract in Spell',
            code: 'System.out.println(java.lang.reflect.Modifier.isAbstract(Spell.class.getDeclaredMethod("manaCost").getModifiers()) && java.lang.reflect.Modifier.isAbstract(Spell.class.getDeclaredMethod("effect").getModifiers()));',
            expected: 'true',
          },
        ],
      },
    },
  ],
};

export default level;
