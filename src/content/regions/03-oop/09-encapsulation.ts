import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'oop-encapsulation',
  title: 'Encapsulation',
  blurb: 'Hide data behind getters and setters that keep it safe.',
  rewards: { xp: 70, coins: 15 },
  flow: [
    {
      type: 'lesson',
      title: 'Keep your secrets safe',
      text:
        "**Encapsulation** means hiding an object's data so other code can't mess it up. You make attributes `private` and offer `public` methods to read or change them **safely**.",
    },
    {
      type: 'lesson',
      title: 'Getters and setters',
      text:
        "A **getter** returns a private value: `getHealth()`. A **setter** changes it: `setHealth(int value)`. By convention, they start with `get` and `set` followed by the attribute name with a capital letter.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            hero.setName("Ari");
            System.out.println(hero.getName());
          }
        }

        class Hero {
          private String name;

          public String getName() {
            return name;
          }

          public void setName(String newName) {
            this.name = newName;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Setters can protect the rules',
      text:
        "The real power: a setter can **refuse** or **fix** bad values. Nobody can give the hero `-50` health, because the only way in is through the setter.",
      code: java`
        public class Main {
          public static void main(String[] args) {
            Hero hero = new Hero();
            hero.setHealth(-50);
            System.out.println(hero.getHealth());
            hero.setHealth(80);
            System.out.println(hero.getHealth());
          }
        }

        class Hero {
          private int health = 100;

          public int getHealth() {
            return health;
          }

          public void setHealth(int value) {
            if (value < 0) {
              value = 0;
            }
            health = value;
          }
        }
      `,
    },
    {
      type: 'lesson',
      title: 'Why it matters',
      text:
        "Encapsulation gives you **control**: you can make values read-only (only a getter), change how data is stored later without breaking other code, and stop invalid states.",
    },
    {
      type: 'choice',
      question: 'An attribute is `private`. How should other classes change it?',
      options: ['Directly with `obj.attr = x`', 'Through a public setter method', 'They cannot use the class', 'By making a copy'],
      answer: 1,
      explain: 'Encapsulation exposes public getters/setters and keeps the attribute private.',
    },
    {
      type: 'blank',
      question: 'Complete the conventional getter name for an attribute called `gold`.',
      code: 'public int ___() {\n  return gold;\n}',
      answers: ['getGold'],
      explain: 'Getters are named `get` + the attribute name with a capital first letter.',
    },
  ],
  challenges: [
    {
      title: 'The Protected Hero',
      story:
        "Write a class `Hero` with a **private** `int health` starting at `100`, plus:\n\n" +
        "- `public int getHealth()`\n" +
        "- `public void setHealth(int value)`: keeps health between **0** and **100** (values above 100 become 100, below 0 become 0)\n" +
        "- `public void takeDamage(int amount)`: lowers health using `setHealth`, so it never goes below 0",
      starterCode: java`
        class Hero {
          private int health = 100;

          public int getHealth() {
            return health;
          }

          // setHealth and takeDamage
        }
      `,
      solution: java`
        class Hero {
          private int health = 100;

          public int getHealth() {
            return health;
          }

          public void setHealth(int value) {
            if (value > 100) {
              value = 100;
            }
            if (value < 0) {
              value = 0;
            }
            health = value;
          }

          public void takeDamage(int amount) {
            setHealth(health - amount);
          }
        }
      `,
      hints: [
        'In setHealth, fix the value first (two ifs), then store it.',
        'takeDamage can simply call setHealth(health - amount); and the setter does the rest.',
      ],
      check: {
        kind: 'harness',
        mode: 'class',
        demo: 'Hero h = new Hero();\nh.takeDamage(30);\nSystem.out.println(h.getHealth());',
        tests: [
          { name: 'Starts at full health', code: 'System.out.println(new Hero().getHealth());', expected: '100' },
          { name: 'Setting a normal value', code: 'Hero h = new Hero();\nh.setHealth(55);\nSystem.out.println(h.getHealth());', expected: '55' },
          { name: 'Too much health', code: 'Hero h = new Hero();\nh.setHealth(150);\nSystem.out.println(h.getHealth());', expected: '100' },
          { name: 'Negative health', code: 'Hero h = new Hero();\nh.setHealth(-5);\nSystem.out.println(h.getHealth());', expected: '0' },
          {
            name: 'Taking damage',
            code: 'Hero h = new Hero();\nh.takeDamage(30);\nSystem.out.println(h.getHealth());\nh.takeDamage(500);\nSystem.out.println(h.getHealth());',
            expected: '70\n0',
          },
          {
            name: 'health is really private',
            code: 'System.out.println(java.lang.reflect.Modifier.isPrivate(Hero.class.getDeclaredField("health").getModifiers()));',
            expected: 'true',
          },
        ],
      },
    },
  ],
};

export default level;
