# Java Quest ☕🗺️

Java Quest is an adventure-mode game for learning Java. You travel across a world map, read short lessons from Bean (your coffee-bean guide), answer quick checks, and solve coding challenges in a real Java editor. Your code runs on your own computer's JDK.

- **3 regions, 42 levels**: Java Basics (18 topics + boss), Methods (6 + boss) and Classes & OOP (15 + boss)
- **Real Java**: code runs with `java Main.java`, and compile and runtime errors are shown in a friendly way, with the bad line highlighted
- **Rewards**: XP and player levels, coins, a day streak, 0 to 3 stars per level, and a badge for each region
- **Light and dark mode**, mobile layout, keyboard friendly

Java Quest runs **on your own computer**: there's no website to sign up for. Follow the steps below once, and you're ready to play.

---

## 🎮 Play it on your computer

You need two free programs and the game files. It takes about 10 minutes the first time.

### 1. Install Node.js

Download the **LTS** version from <https://nodejs.org> and run the installer with the default options. You need version 20 or newer.

### 2. Install Java

Download **Temurin 21 (LTS)** from <https://adoptium.net> and run the installer with the default options. Any JDK 17 or newer works.

- **Windows** shortcut: open PowerShell and run `winget install EclipseAdoptium.Temurin.21.JDK`
- **Mac** with Homebrew: `brew install --cask temurin@21`
- **Linux** (Ubuntu/Debian): `sudo apt install openjdk-21-jdk`

### 3. Download the game

On this GitHub page, click the green **Code** button, then **Download ZIP**, and unzip it somewhere easy to find, such as your Desktop.

If you use Git, you can run `git clone https://github.com/teja120805-cyber/JAVA-ADVENTURE.git` instead.

### 4. Open a terminal in the game folder

- **Windows:** open the unzipped folder (the one with `package.json` in it), click the address bar at the top, type `cmd` and press **Enter**.
- **Mac:** right-click the folder in Finder and choose **New Terminal at Folder**.
- **Linux:** right-click inside the folder and choose **Open in Terminal**.

Open a **new** terminal after installing Node.js and Java, so it can find them. To check, run `node -v` and `java -version`: both should print a version number.

### 5. Start the game

```bash
npm install      # first time only: downloads the game's libraries
npm run dev      # starts the game
```

Then open **<http://localhost:5173>** in your browser and click the glowing level on the map. 🎉

**Next time** you want to play, open a terminal in the folder (step 4), run `npm run dev`, and open the link again. Press `Ctrl+C` in the terminal to stop the game. Your progress is saved automatically to a file on your computer (`.java-quest/save.json` in your user folder), so it's kept when you close the game, and it works in any browser.

**Getting the latest version:** download the ZIP again, or run `git pull` if you cloned it. Then run `npm install` and `npm run dev`. Your progress is kept.

> ⚠️ **Why it runs on your own computer:** the game runs whatever Java code is typed into the editor, with only a simple 5-second time limit and an output limit. That's fine on your own machine, but the runner doesn't stop code from reading or writing files. So **don't put this server on the internet as it is**, or share your running copy with tools like ngrok. It only accepts connections from your own computer (`127.0.0.1`).

---

## How to play

- Click the glowing node on the map (or **Continue** in the top bar) to open the next level.
- Read Bean's steps. **Try it** loads an example into the editor so you can run and change it.
- Answer the quick checks, then solve the challenge and press **Submit**.
- **Stars**: 1 for solving, +1 for using no hints, +1 for passing on the first submission.
- Hidden test details (inputs and expected output) are revealed after 2 failed submissions.
- Shortcuts: `Ctrl+Enter` runs, `Ctrl+Shift+Enter` submits. In the editor, press `Esc` then `Tab` to move focus out.
- Use the **Input** button to type keyboard input for programs that use `Scanner`.
- Progress is saved to `.java-quest/save.json` in your user folder (with a backup copy in the browser), so it's kept when you close the game. To move it to another computer, copy that file. Open the profile/settings menu (your avatar) to change your name and avatar, switch dark mode, **unlock all levels** (for testing), or **reset progress**.

---

## For developers

### Requirements

| Tool | Version | Check with |
| --- | --- | --- |
| Node.js | 20 or newer | `node -v` |
| JDK (Java Development Kit) | 17 or newer | `java -version` |

If the game can't find Java it shows a yellow banner with install steps and a **Check again** button.

### Run it

```bash
npm install      # first time only
npm run dev      # starts the website AND the Java runner
```

Then open <http://localhost:5173>.

`npm run dev` uses `concurrently` to start two things at once:

- **web** (Vite + React) on port 5173
- **api** (Express) on port 3001, which runs your Java code. Vite forwards every `/api/...` request to it.

Press `Ctrl+C` in the terminal to stop both.

## All the scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the game for development (auto-reloads when files change) |
| `npm test` | Unit tests for progress logic (XP, stars, unlocking, streaks) and output comparison |
| `npm run verify-content` | Checks every level: content rules, every "Try it" example runs, and **every reference solution passes its own tests** |
| `npm run typecheck` | TypeScript check |
| `npm run build` | Production build of the website into `dist/` |
| `npm start` | Serve the production build plus the runner (run `npm run build` first) |

## Project structure

```
server/                 Express API (runs Java)
  index.ts              /api/health, /api/run, /api/submit, /api/save
  saves.ts              reads and writes the save file (~/.java-quest/save.json)
  java.ts               finds the JDK and checks its version
  runner.ts             temp folder → java Main.java, timeout, output limit, error parsing
  judge.ts              output tests and hidden "harness" tests
  hints.ts              friendly explanations for common Java errors
  content.ts            loads the level files from disk
scripts/verify-content.ts
src/
  content/
    types.ts            the shape of a level (read this before writing content)
    helpers.ts          the java`...` tag for code blocks
    regions/
      01-basics/        region.ts + one file per level
      02-methods/
      03-oop/
  components/           TopBar, WorldMap, LevelScreen, LessonPane, QuizCard,
                        CodeEditor (CodeMirror 6), Console, Celebration, SettingsModal, art (SVGs)
  lib/
    progress.ts         pure game logic (XP, stars, unlocks, streaks, badges)
    compare.ts          output comparison
    storage.ts          save/load: the server's save file, with localStorage as a backup
  state/game.tsx        React context wrapping the game state
```

## How to add a level

Levels are just data. **Adding a level means adding one file.** Nothing else needs to change.

1. Create a file in a region folder, for example `src/content/regions/01-basics/20-ternary.ts`.
   The **number prefix sets the order** on the map. To slot a level in between two others, use a name that sorts between them, like `13b-...`.
   The **last** file in each region should be its boss (`boss: true`).
2. Default-export a `Level` (see `src/content/types.ts`):

```ts
import { java } from '../../helpers';
import type { Level } from '../../types';

const level: Level = {
  id: 'basics-ternary',              // unique, used in URLs and saves
  title: 'Ternary',
  blurb: 'Short one-line if/else.',
  rewards: { xp: 50, coins: 10 },
  flow: [                            // 3-6 lessons and 1-3 quick checks, in any order
    {
      type: 'lesson',
      title: 'One-line decisions',
      text: 'Text supports `code`, **bold**, lists ("- item") and blank-line paragraphs.',
      code: java`
        public class Main {
          public static void main(String[] args) {
            System.out.println(5 > 3 ? "yes" : "no");
          }
        }
      `,                             // optional; must be a complete program (shows "Try it")
    },
    // ...more lessons...
    {
      type: 'choice',
      question: 'What does `true ? 1 : 2` give?',
      options: ['1', '2'],
      answer: 0,
      explain: 'The condition is true, so the first value is used.',
    },
    { type: 'blank', question: 'Fill the gap.', code: 'x ___ a : b', answers: ['?'], explain: '...' },
  ],
  challenges: [                      // 1 challenge (bosses: 2-3)
    {
      title: 'Is it night?',
      story: 'Print `Night` if hour >= 20...',
      starterCode: java`...`,
      solution: java`...`,           // verify-content checks that this passes
      hints: ['First hint', 'Second hint'],
      check: {
        kind: 'output',              // compare the program's printed output
        tests: [
          { name: 'Evening', stdin: '21', expected: 'Night' },
          { name: 'Morning', stdin: '8', expected: 'Day', hidden: true },
        ],
      },
    },
  ],
};

export default level;
```

There are two kinds of `check`:

- **`output`**: runs the whole program (optionally with `stdin`) and compares the trimmed output with `expected`. `hidden: true` keeps a test's input secret until the player has failed twice.
- **`harness`**: for methods and classes. The player writes only a method (`mode: 'method'`) or only classes (`mode: 'class'`). Each test's `code` (Java statements) runs inside a hidden `Main` and whatever it prints is compared with `expected`. `demo` is the `main()` the **Run** button uses.

3. Run **`npm run verify-content`**. It checks the content rules and runs every example and reference solution through the real runner.
4. To add a whole **region**, make a new folder (such as `04-collections/`) with a `region.ts` exporting a `RegionMeta` (title, theme `meadow` | `forest` | `castle`, badge).

Tip: write code inside the `` java`...` `` tag. It keeps backslashes such as `"\n"` exactly as typed and removes the indentation, so the code can be indented neatly in the file.

## Troubleshooting

- **`npm` or `node` is "not recognized" / "command not found"**: Node.js isn't installed, or the terminal was opened before installing it. Install it (step 1), then open a **new** terminal.
- **`npm install` says it can't find `package.json`**: the terminal isn't in the game folder. Open it in the folder that contains `package.json` (step 4). After unzipping, this is sometimes a folder *inside* the unzipped folder.
- **The page at localhost:5173 won't load**: the game isn't running. Keep the terminal with `npm run dev` open while you play.
- **"The code runner isn't running"**: start the game with `npm run dev`, not just `vite`.
- **"Java needs to be installed"**: install a JDK 17+ (see above), reopen the terminal, then press **Check again**.
- **Port already in use**: something else is using 5173 or 3001. Stop it, or run the server with `PORT=4000` and change the proxy in `vite.config.ts`.
- **Timed out after 5 seconds**: your program probably has an infinite loop, or it's waiting for input. Use the **Input** box.

## Credits

The look and lesson flow are inspired by W3Schools' adventure mode, and the topic order follows the W3Schools Java tutorial. All lesson text, challenges, artwork (inline SVG) and code in this project are original.
