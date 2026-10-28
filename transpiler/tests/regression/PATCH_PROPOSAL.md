# PATCH PROPOSAL: Lua numeric `for` loop (Lua → any target)

**Status:** proposal only. Not applied. The tests in `tests/test_regression.js` describe how the parser behaves today.

## Finding (checked by running the parser)
- File: `javascript/js_transpiler/lua_parser.jison`, line 102 (master `bd753575`):
  `| "for" IDENTIFIER "," e "," e "do" statements "end" {$$ = ["for",$2,["<",$2,$4],["+=",$2,$6],$8];}`
- The real Lua syntax `for i = 1, 3 do x = i end` fails with `Parse error on line 1`. This is test 3.
- The grammar instead accepts `for i, 1, 3 do ... end`, which is not valid Lua. It also lowers wrongly:
  - The start value is never assigned, so there is no init.
  - `$4`, the start value, is used as the loop bound.
  - `$6`, the end value, is used as the step.
  - The bound uses `<`, which is exclusive, but Lua's numeric `for` is inclusive.
- Test 4 records this behaviour.

## Minimal patch
1. In `lua_parser.jison`, replace line 102 with two rules:
   ```
   | "for" IDENTIFIER "=" e "," e "do" statements "end"
       {$$ = ["for",["initialize_var","Object",$2,$4],["<=",[".",[$2]],$6],["+=",$2,[".",["1"]]],$8];}
   | "for" IDENTIFIER "=" e "," e "," e "do" statements "end"
       {$$ = ["for",["initialize_var","Object",$2,$4],["<=",[".",[$2]],$6],["+=",$2,$8],$10];}
   ```
   This assumes the lexer already returns `"="`, since `set_var` uses it. That should be confirmed when the patch is applied.
2. Regenerate `lua_parser.js` with `jison lua_parser.jison`. Pin the jison version: `npm i -D jison@0.4.18`.
3. Check how `transpiler.js` handles the `"for"` node shape, i.e. whether it expects the init as the first element. If the shape it expects differs, adjust the emitted init node to match it.
4. Flip test 3 so it becomes a positive golden test, and add a semantic test that sums 1..3 and expects 6.

**Estimated change:** about 4 grammar lines, plus the regenerated parser (generated diff), plus about 20 test lines.
**Known limitation:** a negative step (`for i = 3, 1, -1`) would need a `>=` bound. That is out of scope for a minimal patch.
