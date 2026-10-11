import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-get-started',
  title: 'Get Started',
  blurb: 'Set up your tools: the JDK, the compiler and the java command.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Packing your toolkit',
      text:
        "To run Java on your own computer you need the **JDK** (Java Development Kit). It contains the compiler and the JVM.\n\n" +
        "Many computers already have Java. Open a terminal and type `java -version` to check. If it prints a version number (17 or newer is great), you're ready.",
    },
    {
      type: 'lesson',
      title: 'Class name = file name',
      text:
        "Java code lives in files ending in `.java`. A file usually holds one public class, and the file **must be named after it**.\n\n" +
        "So `public class Main` goes in a file called `Main.java`. Capital letters matter: `main.java` would not match.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("I live in Main.java!");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Compile, then run',
      text:
        "Running Java is a two-step trip:\n\n" +
        "1. `javac Main.java` **compiles** your code into bytecode (`Main.class`).\n" +
        "2. `java Main` **runs** that bytecode on the JVM.\n\n" +
        "Modern Java can do both at once for a single file: `java Main.java`. That's exactly what the **Run** button does for you here!",
    },
    {
      type: 'choice',
      question: 'Your class is called `Dragon`. What must the file be called?',
      options: ['dragon.java', 'Dragon.java', 'Dragon.class', 'Any name works'],
      answer: 1,
      explain: 'The file name must match the public class name exactly, including capital letters: `Dragon.java`.',
    },
    {
      type: 'lesson',
      title: 'Printing pictures',
      text:
        "Programs can print more than words. Each `println` prints one line, so you can stack lines to draw simple pictures (called ASCII art).\n\n" +
        "Spaces inside the quotes are printed too, which lets you line things up.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("  /\\");
            System.out.println(" /  \\");
            System.out.println("/____\\");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which command compiles `Main.java` into bytecode?',
      options: ['`java Main`', '`javac Main.java`', '`run Main.java`', '`compile Main`'],
      answer: 1,
      explain: '`javac` is the Java **c**ompiler. `java` then runs the compiled program.',
    },
  ],
  challenges: [
    {
      title: 'Light the Campfire',
      story:
        "Night falls over the meadow. Set up camp by printing this campfire, exactly as shown (spaces matter!):\n\n" +
        "```\n   (\n  ) )\n ( ( (\n=======\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("   (");
            // Print the other three lines
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("   (");
            System.out.println("  ) )");
            System.out.println(" ( ( (");
            System.out.println("=======");
          }
        }
      `,
      hints: [
        'Use one System.out.println for each of the four lines.',
        'Count the spaces at the start of each line: 3, 2, 1, then none.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Draws the campfire',
            expected: '   (\n  ) )\n ( ( (\n=======',
          },
        ],
      },
    },
  ],
};

export default level;
