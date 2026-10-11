import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-modifiers',
  title: 'Modifiers',
  blurb: 'Control who can see what (public, private...) and how things behave (static, final).',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Two kinds of modifiers',
      text:
        "**Modifiers** are keywords in front of classes, attributes and methods.\n\n" +
        "- **Access modifiers** control *who* can use something: `public`, `private`, `protected`, or none (default).\n" +
        "- **Non-access modifiers** change *how* it behaves: `static`, `final`, `abstract` and more.",
    },
    {
      type: 'lesson',
      title: 'Access modifiers',
      text:
        "- `public`: anyone can use it\n- `private`: only code **inside the same class** can use it\n" +
        "- *(no modifier)*: code in the same package can use it\n- `protected`: the same package **and** subclasses (you'll meet subclasses in Inheritance)",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Vault vault = new Vault();
            System.out.println(vault.label);
            System.out.println(vault.peek());
            // System.out.println(vault.code); // error: code has private access
          }
        }

        class Vault {
          public String label = "Royal Vault";
          private int code = 1234;

          public String peek() {
            return "The code has " + String.valueOf(code).length() + " digits.";
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'static and final',
      text:
        "`static` makes something belong to the **class** instead of each object, so it's shared. `final` stops it from changing.\n\n" +
        "Together, `static final` makes a **constant**, written in CAPITALS by convention.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println("Max items: " + Shop.MAX_ITEMS);
            System.out.println(Shop.welcome());
          }
        }

        class Shop {
          public static final int MAX_ITEMS = 99;

          public static String welcome() {
            return "Welcome to the shop!";
          }
        }
      `,
    },
    {
      type: 'choice',
      question: 'Which modifier makes an attribute usable **only inside its own class**?',
      options: ['`public`', '`static`', '`private`', '`final`'],
      answer: 2,
      explain: '`private` hides it from all other classes.',
    },
    {
      type: 'choice',
      question: 'How do you usually declare a constant?',
      options: ['`private int max = 5;`', '`static final int MAX = 5;`', '`final static max;`', '`const int MAX = 5;`'],
      answer: 1,
      explain: '`static final` with a CAPITALISED name is Java\'s way to make a constant.',
    },
  ],
  challenges: [
    {
      title: 'The Village Shop',
      story:
        "Write a class `Shop` with:\n\n" +
        "- a constant `public static final int MAX_ITEMS` equal to `99`\n" +
        "- a `public static int priceWithTax(int price)` that adds 10% (use whole-number maths: `price + price / 10`)\n" +
        "- a `private int discount` set to `5`\n" +
        "- a `public int finalPrice(int price)` that returns the price **with tax, minus the discount**",
      starterCode: java`
        class Shop {
          // MAX_ITEMS constant

          // static priceWithTax(int price)

          // private discount

          // finalPrice(int price)
        }
      `,
      solution: java`
        class Shop {
          public static final int MAX_ITEMS = 99;
          private int discount = 5;

          public static int priceWithTax(int price) {
            return price + price / 10;
          }

          public int finalPrice(int price) {
            return priceWithTax(price) - discount;
          }
        }
      `,
      hints: [
        'public static final int MAX_ITEMS = 99;',
        'priceWithTax must be static so it can be called as Shop.priceWithTax(100).',
        'finalPrice can call priceWithTax(price) and then subtract discount.',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'System.out.println(Shop.MAX_ITEMS);\nSystem.out.println(Shop.priceWithTax(100));\nSystem.out.println(new Shop().finalPrice(100));',
        tests: [
          { name: 'The item limit', code: 'System.out.println(Shop.MAX_ITEMS);', expected: '99' },
          { name: 'Adding tax without a shop object', code: 'System.out.println(Shop.priceWithTax(100));\nSystem.out.println(Shop.priceWithTax(55));', expected: '110\n60' },
          { name: 'The final price', code: 'Shop s = new Shop();\nSystem.out.println(s.finalPrice(100));\nSystem.out.println(s.finalPrice(20));', expected: '105\n17' },
        ],
      },
    },
  ],
};

export default level;
