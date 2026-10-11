# Prompt for Claude Code: "Java Quest", an adventure-mode game for learning Java

Paste everything below the line into Claude Code in VS Code, from an empty project folder.

---

Build me a web game called **Java Quest** that teaches Java in an "adventure mode" style. I'm a beginner, so explain the setup steps you take and keep the project easy to run.

## Reference material (read these first)
1. https://www.w3schools.com/adventure/ : the look and feel to copy. Fetch it (and the Java adventure pages it links to) and study the layout, colours, map/path, progress indicators, XP/rewards and lesson flow. Copy the *style and structure*, not their logos, images, mascot or text. Create your own original art (SVG/CSS) and your own wording.
2. https://www.w3schools.com/java/java_intro.asp and the pages in its sidebar : the syllabus and the order of topics. Write lesson text in your own words, short and beginner friendly, with small code examples.

If a page can't be fetched, tell me and continue using the design brief below.

## Design brief (W3Schools-Adventure feel)
- Clean, bright, friendly. W3Schools green (`#04AA6D`) as the primary colour, white/light-grey surfaces, dark text, rounded cards, soft shadows, a playful but readable font (e.g. "Source Sans 3" for text, a rounded display font for headings), monospace for code.
- **World map home screen**: a winding path of level "nodes" across 3 themed regions (one per chapter below). Nodes show locked / unlocked / completed (with 0 to 3 stars). Clicking an unlocked node opens that level. Gentle animations when a level unlocks.
- **Top bar**: game logo, player avatar + name, XP bar with level number, coin/gem counter, streak counter, and a "Continue" button that jumps to the next unfinished level.
- **Level screen** (two panes on desktop, stacked on mobile):
  - Left: the lesson as short "story" steps (a guide character talks to the player in speech bubbles), each step with one concept and a small code example with a "Try it" button.
  - Right: a code editor (Monaco or CodeMirror 6, Java syntax highlighting) with a **Run** button, an output console, and a **Submit** button for the challenge.
  - Quick multiple-choice / fill-in-the-blank checks between lesson steps.
  - Hints that unlock one at a time (using a hint lowers the star score).
- Rewards: XP and coins per level, stars for (correct, no hints, first try), badges for finishing each region, a confetti/celebration screen on completion, a final "boss" challenge per region.
- Fully responsive, keyboard accessible, and with a dark mode toggle.

## Syllabus: one level per topic, in this order

**Region 1: Java Basics (Java Tutorial)**
Intro, Get Started, Syntax, Output, Comments, Variables, Data Types, Type Casting, Operators, Strings, Math, Booleans, If...Else, Switch, While Loop, For Loop, Break/Continue, Arrays. Boss: a small program combining loops, conditions and arrays.

**Region 2: Methods**
Methods, Method Challenge, Method Parameters, Method Overloading, Scope, Recursion. Boss: a recursion challenge.

**Region 3: Classes & OOP**
OOP, Classes/Objects, Class Attributes, Class Methods, Class Challenge, Constructors, this Keyword, Modifiers, Encapsulation, Packages / API, Inheritance, Polymorphism, super Keyword, Inner Classes, Abstraction. Boss: design a small class hierarchy (e.g. an RPG `Character` → `Warrior` / `Mage`).

Each level needs: 3 to 6 lesson steps, 1 to 3 quick checks, and 1 coding challenge (bosses get 2 or 3). Give the challenges an adventure theme (e.g. "count the gold coins in the chest array", "write a method that heals the hero").

## Running and checking Java code
Use a small **Node.js + Express backend** that runs the player's code with the **JDK installed on my machine**:
- Write the code to a temp folder and run it with `java Main.java` (single-file source launch, JDK 17+), with a 5-second timeout, output size limit, and stdin support. Clean up the temp folder afterwards.
- On startup, check that `java` is on PATH and show a friendly setup message in the UI if it isn't (tell me how to install a JDK, e.g. Temurin 21).
- Return compile errors and runtime errors separately and show them nicely in the console, with the line highlighted in the editor.
- **Challenge validation**: each challenge has one or more test cases. Support two kinds:
  1. *Output tests*: run the program (optionally with stdin) and compare trimmed stdout to the expected output.
  2. *Hidden harness tests* (for methods and classes): the player writes a method/class, the server inserts it into a hidden `Main` that calls it with test inputs and prints results, then compares those. Show which tests passed/failed with friendly messages, but don't reveal hidden inputs until the player has failed twice.
- This is for local use only, so a simple process sandbox is enough; note in the README that it should not be deployed publicly as-is.

## Tech stack and structure
- Frontend: **Vite + React + TypeScript**, plain CSS modules or Tailwind (your choice, keep it consistent).
- Backend: Node + Express in `/server`, one `npm run dev` command that starts both (use `concurrently`).
- All content as data, not hard-coded in components: `src/content/regions/*.ts` (or JSON) with lessons, quiz questions, starter code, hints, tests and rewards. Adding a level should only need a new content file.
- Save progress (XP, stars, unlocked levels, code drafts per level, settings) in `localStorage`, with a "Reset progress" option in settings.
- Optional dev toggle to unlock all levels for testing.

## How to work
1. Fetch the references, then show me a short plan (file tree, screens, data shape for a level) before writing lots of code.
2. Build in this order: project setup and runner → map + top bar → level screen with editor and Run → challenge validation → rewards/progress → content for all 3 regions → polish (animations, dark mode, mobile).
3. Write real content for **every** topic listed above, not placeholders. Make sure every challenge's reference solution actually passes its own tests: add a script `npm run verify-content` that runs each challenge's solution through the runner and reports any failures, and run it.
4. Add a few unit tests for the progress logic and the output comparison.
5. Finish with a README: requirements (Node 20+, JDK 17+), how to run, how to add a level.
