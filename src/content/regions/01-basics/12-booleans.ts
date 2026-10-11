import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-booleans',
  title: 'Booleans',
  blurb: 'Yes or no, on or off: true and false.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'True or false',
      text:
        "Lots of questions have only two answers: yes/no, on/off, open/closed. Java's `boolean` type stores exactly that: `true` or `false`.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            boolean isNight = true;
            boolean dragonAwake = false;
            System.out.println(isNight);
            System.out.println(dragonAwake);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Boolean expressions',
      text:
        "A comparison like `gold > 10` is a **boolean expression**: Java works it out and gives `true` or `false`. You can store the answer in a variable.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 12;
            int price = 15;
            boolean canAfford = gold >= price;
            System.out.println(canAfford);
            System.out.println(gold == 12);
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Combining conditions',
      text:
        "Use `&&` when **both** things must be true, `||` when **at least one** must be true, and `!` to flip a value.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            boolean hasKey = true;
            boolean doorLocked = true;
            boolean hasAxe = false;
            System.out.println(hasKey && doorLocked);
            System.out.println(hasKey || hasAxe);
            System.out.println(!doorLocked);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'If `age` is 15, what is `age >= 18 || age == 15`?',
      options: ['`true`', '`false`', '`15`', 'An error'],
      answer: 0,
      explain: 'The first part is false but the second part is true, and `||` only needs one.',
    },
    {
      type: 'choice',
      question: 'What is `!(5 > 3)`?',
      options: ['`true`', '`false`', '`2`', '`5`'],
      answer: 1,
      explain: '`5 > 3` is `true`, and `!` flips it to `false`.',
    },
  ],
  challenges: [
    {
      title: 'The Bridge Toll',
      story:
        "A troll guards a toll bridge. You have **30** gold, the toll is **25**, and you **don't** have a royal pass.\n\n" +
        "Create boolean variables and print:\n\n" +
        "```\nCan pay toll: true\nHas royal pass: false\nMay cross: true\nMust swim: false\n```\n\n" +
        "You **may cross** if you can pay **or** you have a pass. You **must swim** if you may **not** cross.",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 30;
            int toll = 25;
            boolean hasPass = false;
            // Work out the booleans and print them
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            int gold = 30;
            int toll = 25;
            boolean hasPass = false;
            boolean canPay = gold >= toll;
            boolean mayCross = canPay || hasPass;
            boolean mustSwim = !mayCross;
            System.out.println("Can pay toll: " + canPay);
            System.out.println("Has royal pass: " + hasPass);
            System.out.println("May cross: " + mayCross);
            System.out.println("Must swim: " + mustSwim);
          }
        }
      `,
      hints: [
        'boolean canPay = gold >= toll;',
        'boolean mayCross = canPay || hasPass; and boolean mustSwim = !mayCross;',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Works out the toll',
            expected: out`
              Can pay toll: true
              Has royal pass: false
              May cross: true
              Must swim: false
            `,
          },
        ],
      },
    },
  ],
};

export default level;
