"""Validate Atlas v1 fixtures. Exit 0 iff all valid/ pass and all invalid/ fail."""
import json, sys
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

HERE = Path(__file__).parent
schema = json.loads((HERE / "atlas_scientific_record_v1.schema.json").read_text())
Draft202012Validator.check_schema(schema)
v = Draft202012Validator(schema, format_checker=FormatChecker())
ok = True
for kind, expect_valid in (("valid", True), ("invalid", False)):
    for f in sorted((HERE / "fixtures" / kind).glob("*.json")):
        errs = list(v.iter_errors(json.loads(f.read_text())))
        good = (not errs) == expect_valid
        ok &= good
        print(f"{'PASS' if good else 'FAIL'} {kind}/{f.name}: {'valid' if not errs else 'invalid -> ' + errs[0].message[:90]}")
print("RESULT:", "ALL PASS" if ok else "FAILURES")
sys.exit(0 if ok else 1)
