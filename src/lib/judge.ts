import connectDB from './db';
import TestCase from '../models/TestCase';

const PISTON = 'https://emkc.org/api/v2/piston/execute';

/* ── Comparators ────────────────────────────────────── */
const norm = (s: string) => s.replace(/\s+/g, ' ').trim();

const CMP: Record<string, (a: string, b: string) => boolean> = {
  exact: (a, b) => norm(a) === norm(b),
  float: (a, b) => Math.abs(parseFloat(a) - parseFloat(b)) < 1e-4,
  any_valid: (a) => a.trim().length > 0,
  sorted: (a, b) => {
    try { return JSON.stringify(JSON.parse(a).sort()) === JSON.stringify(JSON.parse(b).sort()); }
    catch { return norm(a) === norm(b); }
  },
  unordered: (a, b) => {
    try {
      const s = (x: string) => JSON.parse(x).map((e: any) =>
        JSON.stringify(Array.isArray(e) ? [...e].sort() : e)).sort();
      return JSON.stringify(s(a)) === JSON.stringify(s(b));
    } catch { return norm(a) === norm(b); }
  },
};

/* ── Execute via Piston ─────────────────────────────── */
async function run(code: string, stdin: string) {
  const r = await fetch(PISTON, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: 'c++', version: '10.2.0',
      files: [{ content: code }],
      stdin, compile_timeout: 10000, run_timeout: 10000,
    }),
  });
  const d = await r.json();
  return {
    stdout: (d.run?.stdout || '').trimEnd(),
    stderr: d.run?.stderr || d.compile?.stderr || '',
    compileErr: d.compile?.code !== 0,
    runtimeErr: d.run?.code !== 0,
  };
}

/* ── Main Judge ─────────────────────────────────────── */
export async function judge(problemId: number, userCode: string) {
  await connectDB();
  const tc = await TestCase.findOne({ problemId }).lean();
  if (!tc) return { error: 'No test cases for this problem' };

  const compare = CMP[tc.compareMode] || CMP.exact;
  const fullCode = userCode + '\n' + tc.driver;
  const stdin = tc.tests.length + '\n' + tc.tests.map((t: any) => t.input).join('\n');

  const exec = await run(fullCode, stdin);

  if (exec.compileErr) return { verdict: 'Compilation Error', error: exec.stderr, passed: 0, total: tc.tests.length, score: 0, results: [] };
  if (exec.runtimeErr && !exec.stdout) return { verdict: 'Runtime Error', error: exec.stderr, passed: 0, total: tc.tests.length, score: 0, results: [] };

  const lines = exec.stdout.split('\n');
  const results = tc.tests.map((t: any, i: number) => {
    const actual = (lines[i] || '').trim();
    const pass = compare(actual, t.expected);
    return { index: i + 1, pass, level: t.level, input: t.input, expected: t.expected, actual };
  });

  const passed = results.filter((r: any) => r.pass).length;
  return {
    verdict: passed === tc.tests.length ? 'Accepted' : 'Wrong Answer',
    passed, total: tc.tests.length,
    score: Math.round((passed / tc.tests.length) * 100),
    results,
  };
}
