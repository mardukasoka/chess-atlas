---
name: Browser script scope
description: Classic browser scripts share top-level lexical declarations across files.
---

When adding a browser-loaded module that exposes a global, downstream classic scripts must use a differently named local alias rather than redeclaring the same top-level `const`.

**Why:** A duplicate top-level lexical declaration stops the entire downstream script from executing, even when the module itself loaded successfully.

**How to apply:** Keep exported browser globals distinct from local integration aliases, and verify the browser runtime after changing script order or adding a new classic script.