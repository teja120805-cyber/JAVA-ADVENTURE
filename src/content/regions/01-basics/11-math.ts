import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-math',
  title: 'Math',
  blurb: 'Use the Math toolbox: max, min, sqrt, abs, pow, round and random.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'The Math toolbox',
      text:
        "Java comes with a `Math` class full of ready-made maths tools. You use them by writing `Math.` and the tool's name.\n\n" +
        "`Math.max(a, b)` gives the bigger number, `Math.min(a, b)` the smaller one.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(Math.max(12, 40));
            System.out.println(Math.min(12, 40));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Roots, powers and distances',
      text:
        "`Math.sqrt(x)` gives the square root, `Math.pow(a, b)` gives `a` to the power of `b`, and `Math.abs(x)` gives the distance from zero (always positive).\n\n" +
        "`sqrt` and `pow` always return a `double`, so you'll see a `.0` on the end.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(Math.sqrt(81));
            System.out.println(Math.pow(2, 8));
            System.out.println(Math.abs(-7));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Rounding',
      text:
        "`Math.round(x)` rounds to the nearest whole number. `Math.ceil(x)` always rounds **up**, and `Math.floor(x)` always rounds **down**.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(Math.round(4.5));
            System.out.println(Math.ceil(4.1));
            System.out.println(Math.floor(4.9));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Rolling dice',
      text:
        "`Math.random()` gives a random decimal from 0.0 up to (but not including) 1.0.\n\n" +
        "To roll a 6-sided die, multiply and cast: `(int) (Math.random() * 6) + 1`. Run it a few times: the result changes!",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int roll = (int) (Math.random() * 6) + 1;
            System.out.println("You rolled a " + roll);
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `Math.max(-3, -8)` return?',
      options: ['`-8`', '`-3`', '`8`', '`3`'],
      answer: 1,
      explain: '-3 is bigger than -8 (it is closer to zero).',
    },
    {
      type: 'blank',
      question: 'Fill in the method that gives the square root.',
      code: 'double side = Math.___(49);',
      answers: ['sqrt'],
      explain: '`Math.sqrt(49)` is `7.0`.',
    },
  ],
  challenges: [
    {
      title: "The Archer's Aim",
      story:
        "Help the archer line up a shot. Use `Math` methods to print:\n\n" +
        "```\nDistance: 5.0\nDamage: 18\nRecoil: 12\nCombo: 32.0\nBest roll: 19\n```\n\n" +
        "- **Distance** to a target 3 steps across and 4 steps up: the square root of `3*3 + 4*4`\n" +
        "- **Damage**: `17.6` rounded\n- **Recoil**: the absolute value of `-12`\n- **Combo**: 2 to the power of 5\n- **Best roll**: the bigger of `14` and `19`",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Distance: " + Math.sqrt(3 * 3 + 4 * 4));
            // Damage, Recoil, Combo, Best roll...
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Distance: " + Math.sqrt(3 * 3 + 4 * 4));
            System.out.println("Damage: " + Math.round(17.6));
            System.out.println("Recoil: " + Math.abs(-12));
            System.out.println("Combo: " + Math.pow(2, 5));
            System.out.println("Best roll: " + Math.max(14, 19));
          }
        }
      `,
      hints: [
        'You need Math.round, Math.abs, Math.pow and Math.max.',
        'Math.pow(2, 5) gives 32.0 (a double), which is exactly what the output expects.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Lines up the shot',
            expected: out`
              Distance: 5.0
              Damage: 18
              Recoil: 12
              Combo: 32.0
              Best roll: 19
            `,
          },
        ],
      },
    },
  ],
};

export default level;
