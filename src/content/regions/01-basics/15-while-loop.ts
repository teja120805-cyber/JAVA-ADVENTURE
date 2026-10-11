import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-while-loop',
  title: 'While Loop',
  blurb: 'Repeat code for as long as a condition stays true.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Doing things again and again',
      text:
        "A **loop** repeats a block of code. The `while` loop keeps going **as long as** its condition is true, checking before every round.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int lap = 1;
            while (lap <= 3) {
              System.out.println("Running lap " + lap);
              lap++;
            }
            System.out.println("Race finished!");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: "Don't forget to change something",
      text:
        "Something inside the loop must eventually make the condition **false**. If you forget `lap++` above, the loop never ends: an **infinite loop**.\n\n" +
        "(Here, the game stops any program after 5 seconds, so you're safe to experiment.)",
    },
    {
      type: 'lesson',
      title: 'Counting down',
      text: "Loops can count in any direction and by any step size.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int countdown = 5;
            while (countdown > 0) {
              System.out.println(countdown + "...");
              countdown--;
            }
            System.out.println("Liftoff!");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'do/while runs at least once',
      text:
        "A `do/while` loop checks its condition **after** each round, so the body always runs at least once, even if the condition starts out false.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int tries = 10;
            do {
              System.out.println("Trying the door... (try " + tries + ")");
              tries++;
            } while (tries < 3);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'How many times does this print "Hi"?',
      code: 'int i = 0;\nwhile (i < 4) {\n  System.out.println("Hi");\n  i += 2;\n}',
      options: ['1', '2', '4', 'Forever'],
      answer: 1,
      explain: '`i` goes 0, 2, then 4 stops the loop, so it prints **2** times.',
    },
    {
      type: 'choice',
      question: 'Which loop always runs its body at least once?',
      options: ['`while`', '`do/while`', 'Both', 'Neither'],
      answer: 1,
      explain: '`do/while` checks the condition after running the body.',
    },
  ],
  challenges: [
    {
      title: 'Swing Until Tired',
      story:
        "Your hero has **10** energy and each sword swing costs **3**. Using a `while` loop, keep swinging while energy is above 0, then print a final line:\n\n" +
        "```\nSwing! Energy: 10\nSwing! Energy: 7\nSwing! Energy: 4\nSwing! Energy: 1\nOut of energy!\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int energy = 10;
            // while energy is above 0: print, then use 3 energy

            System.out.println("Out of energy!");
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int energy = 10;
            while (energy > 0) {
              System.out.println("Swing! Energy: " + energy);
              energy -= 3;
            }
            System.out.println("Out of energy!");
          }
        }
      `,
      hints: [
        'The condition is energy > 0.',
        'Print first, then do energy -= 3; inside the loop.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Swings until tired',
            expected: out`
              Swing! Energy: 10
              Swing! Energy: 7
              Swing! Energy: 4
              Swing! Energy: 1
              Out of energy!
            `,
          },
        ],
      },
    },
  ],
};

export default level;
