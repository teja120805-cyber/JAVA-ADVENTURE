import { java, out } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-strings',
  title: 'Strings',
  blurb: 'Work with text: length, case, searching and special characters.',
  rewards: { xp: 50, coins: 10 },
  flow: [
    {
      type: 'lesson',
      title: 'Strings are objects',
      text:
        "A `String` holds text. Because it's an object, it comes with useful **methods** you call with a dot.\n\n" +
        "`length()` tells you how many characters it has (spaces count too).",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String spell = "Abracadabra";
            System.out.println(spell.length());
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Changing case and finding text',
      text:
        "`toUpperCase()` and `toLowerCase()` give a new String in a different case.\n\n" +
        "`indexOf(\"text\")` tells you **where** some text starts. Positions start counting at **0**. `charAt(i)` gives the character at a position.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String map = "Treasure under the old oak";
            System.out.println(map.toUpperCase());
            System.out.println(map.toLowerCase());
            System.out.println(map.indexOf("oak"));
            System.out.println(map.charAt(0));
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Joining strings',
      text:
        "`+` joins (concatenates) strings. You can also use `concat()`.\n\n" +
        "Careful with numbers: `\"1\" + 2 + 3` is `\"123\"`, but `1 + 2 + \"3\"` is `\"33\"`, because Java works left to right.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            String first = "Ari";
            String last = "Stormwind";
            System.out.println(first + " " + last);
            System.out.println(first.concat(last));
            System.out.println("1" + 2 + 3);
            System.out.println(1 + 2 + "3");
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Special characters',
      text:
        "To put a double quote **inside** a String, write `\\\"`. A backslash starts an **escape sequence**:\n\n" +
        "`\\\"` double quote, `\\\\` backslash, `\\n` new line, `\\t` tab.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("The wizard said \"Hello\".");
            System.out.println("Line one\nLine two");
            System.out.println("Path: C:\\maps");
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'What does `"dragon".indexOf("g")` return?',
      options: ['`2`', '`3`', '`4`', '`-1`'],
      answer: 1,
      explain: 'd=0, r=1, a=2, g=**3**. Positions start at 0.',
    },
    {
      type: 'choice',
      question: 'How do you print a double quote inside a String?',
      options: ['`""`', "`'\"'`", '`\\"`', 'You cannot'],
      answer: 2,
      explain: 'The escape sequence `\\"` puts a double quote inside a String.',
    },
  ],
  challenges: [
    {
      title: 'Decode the Scroll',
      story:
        "An old scroll reads `the dragon sleeps`. Use String methods on the `scroll` variable to print:\n\n" +
        "```\nTHE DRAGON SLEEPS\nLength: 17\nDragon found at: 4\nThe scroll says \"beware\"\n```",
      starterCode: java`
        public class Main {
          public static void main(String[] args) {
            String scroll = "the dragon sleeps";
            // 1. the scroll in capitals
            // 2. its length
            // 3. where "dragon" starts
            // 4. the warning, with quotes around beware
          }
        }
      `,
      solution: java`
        public class Main {
          public static void main(String[] args) {
            String scroll = "the dragon sleeps";
            System.out.println(scroll.toUpperCase());
            System.out.println("Length: " + scroll.length());
            System.out.println("Dragon found at: " + scroll.indexOf("dragon"));
            System.out.println("The scroll says \"beware\"");
          }
        }
      `,
      hints: [
        'scroll.toUpperCase(), scroll.length() and scroll.indexOf("dragon") do the hard work.',
        'Write \\" for each double quote inside the last String.',
      ],
      check: {
        kind: 'output',
        tests: [
          {
            name: 'Decodes the scroll',
            expected: out`
              THE DRAGON SLEEPS
              Length: 17
              Dragon found at: 4
              The scroll says "beware"
            `,
          },
        ],
      },
    },
  ],
};

export default level;
