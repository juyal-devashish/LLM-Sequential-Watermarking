# Original standalone demonstrations

These files are preserved examples from the research implementation, moved from `demo/`. They are separate from the proposed interactive exhibit.

After installing the experiment dependencies, run Python examples directly so their sibling RNG/Cython imports resolve:

```bash
python examples/legacy_demo/generate.py --help
python examples/legacy_demo/detect.py --help
```

The JavaScript files do not implement the project's sequential test and are not verified equivalent to the Python detector. Their fixed vocabulary size and window aggregation need review before any reuse. Keep embedded source notices intact.
