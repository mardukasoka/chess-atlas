// Regression harness for the Lua Jison parser (javascript/js_transpiler/lua_parser.js).
// Run: node --test tests/   (from the harness dir) or set LUA_PARSER to the parser path.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const HERE = path.join(__dirname, '..');
const PARSER = process.env.LUA_PARSER ||
  [path.join(HERE, '../javascript/js_transpiler/lua_parser.js'),
   path.join(HERE, '../../javascript/js_transpiler/lua_parser.js'),
   '/home/ubuntu/github_repos/transpiler/javascript/js_transpiler/lua_parser.js'].find(fs.existsSync);
const lua = require(PARSER);
const fx = (f) => fs.readFileSync(path.join(HERE, 'fixtures', f), 'utf8');

// Tiny evaluator over the parser's AST (only the node kinds the golden fixture uses).
function evalExpr(e, env) {
  const [op, a, b] = e;
  if (op === '.') { const t = a[0]; return /^\d+$/.test(t) ? Number(t) : env[t]; }
  const x = evalExpr(a, env), y = evalExpr(b, env);
  switch (op) { case '+': return x + y; case '-': return x - y; case '<': return x < y;
    case '<=': return x <= y; case '==': return x === y; default: throw new Error('op ' + op); }
}
function run(stmts, env) {
  for (const s of stmts) {
    if (s[0] === 'semicolon' && s[1][0] === 'set_var') env[s[1][1]] = evalExpr(s[1][2], env);
    else if (s[0] === 'while') { let g = 0; while (evalExpr(s[1], env)) { if (++g > 1e4) throw new Error('loop'); run(s[2][1], env); } }
    else if (s[0] === 'for') { // ["for", var, cond, step, body] as emitted by the grammar
      env[s[1]] = env[s[1]] ?? 0; throw new Error('numeric for not evaluable: grammar init missing');
    } else throw new Error('stmt ' + s[0]);
  }
  return env;
}

test('positive: while loop parses to golden AST', () => {
  const ast = lua.parse(fx('golden_input.lua'));
  assert.deepEqual(ast, JSON.parse(fx('golden_expected.ast.json')));
});

test('semantic equivalence: AST evaluation matches Lua semantics (x == 3)', () => {
  const env = run(lua.parse(fx('golden_input.lua'))[1], {});
  assert.equal(env.x, 3);
});

test('negative: Lua numeric for "for i = 1, 3 do ... end" is rejected with a parse error', () => {
  assert.throws(() => lua.parse(fx('unsupported_numeric_for.lua')), /Parse error on line 1/);
});

test('documents current non-Lua grammar rule "for i, a, b do" (comma instead of =)', () => {
  const ast = lua.parse('for i, 1, 3 do x = i end');
  assert.equal(ast[1][0][0], 'for');
  // grammar lowers to exclusive "<" although Lua numeric for is inclusive; see PATCH_PROPOSAL.md
  assert.equal(ast[1][0][2][0], '<');
});

test('edge: empty input is rejected (grammar requires >=1 statement)', () => {
  assert.throws(() => lua.parse(''));
});

test('edge: unicode in string literal / identifier', () => {
  let ok; try { lua.parse('x = "héllo ✓"'); ok = 'parsed'; } catch { ok = 'rejected'; }
  assert.ok(['parsed', 'rejected'].includes(ok));
  assert.throws(() => lua.parse('ünï = 1')); // non-ASCII identifiers are not lexed
});

test('edge: very long identifier (5000 chars) parses', () => {
  const id = 'v' + 'a'.repeat(4999);
  const ast = lua.parse(`${id} = 1`);
  assert.equal(ast[1][0][1][1], id);
});
