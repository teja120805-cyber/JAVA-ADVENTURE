import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-intro',
  title: 'Java Intro',
  blurb: 'Meet Java and run your very first program.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Welcome, adventurer!',
      text:
        "Hi! I'm **Bean**, your guide. Together we'll learn **Java**, one of the most popular programming languages in the world.\n\n" +
        'Java runs Android apps, bank systems, games like Minecraft, and huge websites. It first appeared in 1995 and is still everywhere today.',
    },
    {
      type: 'lesson',
      title: 'Write once, run anywhere',
      text:
        'Java code is turned into **bytecode** that runs on the Java Virtual Machine (JVM). ' +
        'Any computer with a JVM can run that bytecode: Windows, Mac, Linux, even tiny devices.\n\n' +
        "That's why people say Java is *write once, run anywhere*.",
    },
    {
      type: 'lesson',
      title: 'Your first program',
      text:
        'Here is a complete Java program. Every Java program lives inside a **class**, and starts running in a method called `main`.\n\n' +
        'Press **Try it** to load it into the editor, then press **Run**.',
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Hello, adventurer!");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Where does a Java program start running?',
      options: ['In the first line of the file', 'In the main method', 'In a method called start', 'Anywhere Java likes'],
      answer: 1,
      explain: 'Java always starts with `public static void main(String[] args)`.',
    },
    {
      type: 'lesson',
      title: 'Printing text',
      text:
        '`System.out.println(...)` prints whatever is inside the brackets, then moves to a new line. ' +
        'Text must be wrapped in double quotes, like `"Hello"`.\n\nYou can call it as many times as you like: each call prints a new line.',
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Java Quest begins!");
            System.out.println("Ready your keyboard.");
          }
        }
      `,
    },
    {
      type: 'blank',
      question: 'Fill in the blank to print a line of text.',
      code: 'System.out.___("Hi!");',
      answers: ['println', 'print'],
      explain: '`println` prints and then starts a new line.',
    },
  ],
  challenges: [
    {
      title: 'The Gatekeeper',
      story:
        'A sleepy gatekeeper guards the meadow. He will only open the gate if you greet him properly.\n\n' +
        'Write a program that prints exactly:\n\n```\nHello, Gatekeeper!\nMay I pass?\n```',
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            // Print the two lines here
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Hello, Gatekeeper!");
            System.out.println("May I pass?");
          }
        }
      `,
      hints: [
        'Use System.out.println("...") once for each line.',
        'Check the punctuation: a comma after Hello, and a question mark at the end of the second line.',
      ],
      check: {
        kind: 'output',
        tests: [{ name: 'Greets the gatekeeper', expected: out`
          Hello, Gatekeeper!
          May I pass?
        ` }],
      },
    },
  ],
};

export default level;
