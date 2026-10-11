// Checks every level: content rules, every "Try it" example runs, every reference
// solution passes its own tests, and every starter compiles. Run: npm run verify-content
import { loadRegions } from '../server/content';
import { detectJava } from '../server/java';
import { judge, runForPlayer } from '../server/judge';

const java = await detectJava();
if (!java.ok) {
  console.error(`✘ ${java.message}`);
  process.exit(1);
}

const regions = await loadRegions();
const problems: string[] = [];
const warnings: string[] = [];
const seen = new Set<string>();
const tasks: Promise<void>[] = [];
let runs = 0;

for (const region of regions) {
  region.levels.forEach((level, li) => {
    const where = `${region.id}/${level.id}`;
    const fail = (msg: string) => problems.push(`${where}: ${msg}`);

    // ---- Structure rules ----
    if (seen.has(level.id)) fail('duplicate level id');
    seen.add(level.id);
    const lessons = level.flow.filter((f) => f.type === 'lesson');
    const quizzes = level.flow.filter((f) => f.type !== 'lesson');
    if (lessons.length < 3 || lessons.length > 6) fail(`has ${lessons.length} lesson steps (want 3-6)`);
    if (quizzes.length < 1 || quizzes.length > 3) fail(`has ${quizzes.length} quick checks (want 1-3)`);
    const isFinale = li === region.levels.length - 1;
    if (isFinale && !level.boss) fail('last level of a region should be a boss');
    const [minC, maxC] = level.boss ? [2, 3] : [1, 1];
    if (level.challenges.length < minC || level.challenges.length > maxC) {
      fail(`has ${level.challenges.length} challenges (want ${minC}-${maxC})`);
    }
    for (const q of quizzes) {
      if (q.type === 'choice' && (q.answer < 0 || q.answer >= q.options.length)) fail(`quiz "${q.question}" answer out of range`);
      if (q.type === 'blank' && (!q.code.includes('___') || q.answers.length === 0)) fail(`blank quiz "${q.question}" needs ___ and answers`);
    }

    // ---- Examples must run cleanly ----
    lessons.forEach((step) => {
      if (step.type !== 'lesson' || !step.code) return;
      runs++;
      tasks.push(
        runForPlayer(step.code, '').then((r) => {
          if (r.status !== 'ok') fail(`example "${step.title}" → ${r.status}: ${r.errors.map((e) => `${e.line ?? '?'}: ${e.message}`).join('; ')}`);
        }),
      );
    });

    // ---- Challenges ----
    level.challenges.forEach((ch, ci) => {
      const name = `challenge ${ci + 1} "${ch.title}"`;
      if (ch.hints.length === 0) fail(`${name} has no hints`);
      if (ch.check.tests.length === 0) fail(`${name} has no tests`);

      runs++;
      tasks.push(
        judge(ch, ch.solution, 0).then((res) => {
          if (res.passed) return;
          if (res.run) fail(`${name} solution → ${res.run.status}: ${res.run.errors.map((e) => `${e.line ?? '?'}: ${e.message}`).join('; ')}`);
          for (const t of res.tests.filter((t) => !t.passed)) {
            fail(`${name} solution fails "${t.name}": ${t.message}\n      got: ${JSON.stringify(t.details?.actual)}`);
          }
        }),
      );

      runs++;
      tasks.push(
        runForPlayer(ch.starterCode, '', ch).then((r) => {
          // Errors in hidden demo code just mean "not written yet"; errors in the starter itself are worth a look.
          const own = r.errors.filter((e) => e.line !== null);
          if (r.status === 'compile_error' && own.length > 0 && !ch.starterHasBugs) {
            warnings.push(`${where}: ${name} starter code has errors: ${own.map((e) => `line ${e.line}: ${e.message}`).join('; ')}`);
          }
        }),
      );

      if (ch.check.kind === 'harness') {
        runs++;
        tasks.push(
          runForPlayer(ch.solution, '', ch).then((r) => {
            if (r.status !== 'ok') fail(`${name} demo main with the solution → ${r.status}: ${r.errors.map((e) => e.message).join('; ')}`);
          }),
        );
      }
    });
  });
}

const levelCount = regions.reduce((n, r) => n + r.levels.length, 0);
console.log(`Checking ${regions.length} regions, ${levelCount} levels (${runs} Java runs)…`);
const started = Date.now();
await Promise.all(tasks);
console.log(`Done in ${((Date.now() - started) / 1000).toFixed(1)}s.\n`);

for (const w of warnings) console.log(`⚠ ${w}`);
if (problems.length) {
  for (const p of problems) console.log(`✘ ${p}`);
  console.log(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log('✔ All content checks passed.');
