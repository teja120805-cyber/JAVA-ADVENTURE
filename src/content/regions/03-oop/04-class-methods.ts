import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-class-methods',
  title: 'Class Methods',
  blurb: 'Give objects actions: static methods versus object methods.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Objects can do things',
      text:
        "Classes can hold **methods** as well as attributes. A method written **without** `static` belongs to each object, and you call it through the object with a dot.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Lantern lantern = new Lantern();
            lantern.light();
          }
        }

        class Lantern {
          void light() {
            System.out.println("The lantern glows warmly.");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Methods use the object\'s attributes',
      text:
        "Object methods can read and change that object's own attributes. Two lanterns each remember whether **they** are lit.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Lantern a = new Lantern();
            Lantern b = new Lantern();
            a.light();
            System.out.println("a: " + a.lit + ", b: " + b.lit);
          }
        }

        class Lantern {
          boolean lit = false;

          void light() {
            lit = true;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'static versus object methods',
      text:
        "A `static` method belongs to the **class** itself, so you can call it without making an object: `Lantern.howToLight()`.\n\n" +
        "An object (non-static) method needs an object: `myLantern.light()`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Lantern.howToLight();         // static: no object needed
            Lantern myLantern = new Lantern();
            myLantern.light();            // needs an object
          }
        }

        class Lantern {
          static void howToLight() {
            System.out.println("Strike a match near the wick.");
          }

          void light() {
            System.out.println("Your lantern is lit.");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: '`void open()` is a non-static method in class `Door`. How do you call it?',
      options: ['`Door.open();`', '`open(Door);`', '`Door d = new Door(); d.open();`', '`new open();`'],
      answer: 2,
      explain: 'Non-static methods are called on an object: create one, then `d.open()`.',
    },
    {
      type: 'choice',
      question: 'Which method can be called as `Map.draw()` without creating an object?',
      options: ['`void draw()`', '`static void draw()`', '`final void draw()`', '`Map draw()`'],
      answer: 1,
      explain: '`static` methods belong to the class.',
    },
  ],
  challenges: [
    {
      title: 'The Lantern',
      story:
        "Write a class `Lantern` with:\n\n" +
        "- a `boolean` attribute `lit`, starting as `false`\n" +
        "- `void light()`: sets `lit` to `true` and prints `The lantern glows.`\n" +
        "- `void putOut()`: sets `lit` to `false` and prints `Darkness.`\n" +
        "- `String status()`: **returns** `\"lit\"` or `\"dark\"`",
      starterCode: java`
        class Lantern {
          boolean lit = false;

          void light() {
            // ...
          }

          // putOut() and status()
        }
      `,
      solution: java`
        class Lantern {
          boolean lit = false;

          void light() {
            lit = true;
            System.out.println("The lantern glows.");
          }

          void putOut() {
            lit = false;
            System.out.println("Darkness.");
          }

          String status() {
            return lit ? "lit" : "dark";
          }
        }
      `,
      hints: [
        'light() needs two lines: lit = true; and the println.',
        'status() returns a String: if lit is true return "lit", otherwise "dark".',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Lantern l = new Lantern();\nl.light();\nSystem.out.println(l.status());',
        tests: [
          { name: 'Starts dark', code: 'System.out.println(new Lantern().status());', expected: 'dark' },
          { name: 'Lighting it', code: 'Lantern l = new Lantern();\nl.light();\nSystem.out.println(l.status());', expected: 'The lantern glows.\nlit' },
          {
            name: 'Putting it out again',
            code: 'Lantern l = new Lantern();\nl.light();\nl.putOut();\nSystem.out.println(l.status() + " " + l.lit);',
            expected: 'The lantern glows.\nDarkness.\ndark false',
          },
          {
            name: 'Two lanterns are separate',
            code: 'Lantern a = new Lantern();\nLantern b = new Lantern();\na.light();\nSystem.out.println(a.status() + " " + b.status());',
            expected: 'The lantern glows.\nlit dark',
          },
        ],
      },
    },
  ],
};

export default level;
