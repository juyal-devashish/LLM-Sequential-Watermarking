# Environments

`conda-linux-64.txt` is the original requirements file, preserved without changes. It includes Linux build identifiers and CUDA-specific PyTorch packages.

The root `pyproject.toml` now defines platform-neutral dependency groups. Use Python 3.11 and install the project in editable mode; dependency resolution and model/Cython runtime execution still need validation. The historical export is retained for provenance rather than advertised as a macOS installer.
