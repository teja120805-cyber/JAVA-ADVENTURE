import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'methods-boss',
  title: 'The Recursive Wizard',
  blurb: 'Boss battle! Outsmart the wizard with recursive spells.',
  boss: true,
  rewards: { xp: 180, coins: 50 },
  flow: [
    {
      type: 'lesson',
      title: 'A wizard blocks the path',
      text:
        "Deep in the woods, the **Recursive Wizard** guards the way out. He only respects spells that call themselves.\n\n" +
        "Three trials await. Each one asks for a recursive method with a clear **base case** and a **smaller step**.",
    },
    {
      type: 'lesson',
      title: 'Two recursive calls',
      text:
        "A method may call itself **more than once**. The Fibonacci numbers start `0, 1`, and every next number is the sum of the two before it: `0, 1, 1, 2, 3, 5, 8, 13...`\n\n" +
        "So `fib(n) = fib(n - 1) + fib(n - 2)`, with base cases `fib(0) = 0` and `fib(1) = 1`.",
    },
    {
      type: 'lesson',
      title: 'Peeling off digits',
      text:
        "Two handy tricks for numbers: `n % 10` gives the **last digit**, and `n / 10` **removes** the last digit.\n\n" +
        "For text: `s.charAt(0)` is the first character, and `s.substring(1)` is everything **after** it.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            int n = 4721;
            System.out.println(n % 10);
            System.out.println(n / 10);
            String s = "magic";
            System.out.println(s.charAt(0));
            System.out.println(s.substring(1));
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What is `fib(6)` in the sequence 0, 1, 1, 2, 3, 5, 8, 13...? (`fib(0)` is 0)',
      options: ['`5`', '`8`', '`13`', '`6`'],
      answer: 1,
      explain: 'Counting from fib(0): 0, 1, 1, 2, 3, 5, **8**.',
    },
    {
      type: 'blank',
      question: 'Get everything after the first character of `word`.',
      code: 'String rest = word.___(1);',
      answers: ['substring'],
      explain: '`substring(1)` starts at index 1 and goes to the end.',
    },
  ],
  challenges: [
    {
      title: 'Trial 1: The Golden Spiral',
      story:
        "Write a recursive method `static int fib(int n)` that returns the `n`th Fibonacci number, where `fib(0)` is `0` and `fib(1)` is `1`.",
      starterCode: java`
        static int fib(int n) {
          // base cases for 0 and 1

          // recursive case
          return 0;
        }
      `,
      solution: java`
        static int fib(int n) {
          if (n <= 1) {
            return n;
          }
          return fib(n - 1) + fib(n - 2);
        }
      `,
      hints: [
        'Base case: if n is 0 or 1, return n itself.',
        'Recursive case: return fib(n - 1) + fib(n - 2);',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'for (int i = 0; i <= 10; i++) {\n  System.out.print(fib(i) + " ");\n}\nSystem.out.println();',
        tests: [
          { name: 'The first two numbers', code: 'System.out.println(fib(0) + " " + fib(1));', expected: '0 1' },
          { name: 'The tenth number', code: 'System.out.println(fib(10));', expected: '55' },
          { name: 'A bigger one', code: 'System.out.println(fib(20));', expected: '6765' },
          { name: 'The start of the spiral', code: 'for (int i = 0; i < 8; i++) System.out.print(fib(i) + ",");', expected: '0,1,1,2,3,5,8,13,' },
        ],
      },
    },
    {
      title: 'Trial 2: Rune Sums',
      story:
        "The wizard's door has a number lock. Write a recursive method `static int digitSum(int n)` that adds up all the digits of a non-negative number.\n\n" +
        "`digitSum(1234)` is `1 + 2 + 3 + 4 = 10`. A single digit is its own sum.",
      starterCode: java`
        static int digitSum(int n) {
          // base case: a single digit

          // last digit + digitSum of the rest
          return 0;
        }
      `,
      solution: java`
        static int digitSum(int n) {
          if (n < 10) {
            return n;
          }
          return n % 10 + digitSum(n / 10);
        }
      `,
      hints: [
        'If n < 10, it is a single digit: return n.',
        'Otherwise: return n % 10 + digitSum(n / 10);',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(digitSum(1234));',
        tests: [
          { name: 'Four digits', code: 'System.out.println(digitSum(1234));', expected: '10' },
          { name: 'Zero', code: 'System.out.println(digitSum(0));', expected: '0' },
          { name: 'One digit', code: 'System.out.println(digitSum(9));', expected: '9' },
          { name: 'Lots of nines', code: 'System.out.println(digitSum(99999));', expected: '45' },
          { name: 'Zeros in the middle', code: 'System.out.println(digitSum(1000005));', expected: '6' },
        ],
      },
    },
    {
      title: 'Trial 3: The Backwards Spell',
      story:
        "To break the final ward, speak its name **backwards**! Write a recursive method `static String reverse(String s)` that returns `s` reversed.\n\n" +
        "`reverse(\"spell\")` returns `\"lleps\"`. An empty String reversed is still empty.",
      starterCode: java`
        static String reverse(String s) {
          // base case: an empty String

          // reverse the rest, then add the first character on the end
          return s;
        }
      `,
      solution: java`
        static String reverse(String s) {
          if (s.isEmpty()) {
            return s;
          }
          return reverse(s.substring(1)) + s.charAt(0);
        }
      `,
      hints: [
        'Base case: if (s.isEmpty()) return s;  (or s.length() == 0)',
        'The reverse of "spell" is the reverse of "pell" followed by "s".',
        'return reverse(s.substring(1)) + s.charAt(0);',
      ],
      check: {
        kind: 'harness',
        mode: 'method',
        demo: 'System.out.println(reverse("spell"));',
        tests: [
          { name: 'Reverses a word', code: 'System.out.println(reverse("spell"));', expected: 'lleps' },
          { name: 'An empty spell', code: 'System.out.println("[" + reverse("") + "]");', expected: '[]' },
          { name: 'A single letter', code: 'System.out.println(reverse("a"));', expected: 'a' },
          { name: 'A sentence', code: 'System.out.println(reverse("open the gate"));', expected: 'etag eht nepo' },
        ],
      },
    },
  ],
};

export default level;
