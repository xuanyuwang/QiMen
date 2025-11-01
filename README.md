# QiMen

生成指定时刻的奇门遁甲盘的小型工具。

## Overview
- **Goal**: Accept a Gregorian datetime and output all components of the corresponding 奇门遁甲盘 (局数、宫位布阵、天干、地支、八门、九星、神).  
- **Audience**: Practitioners and learners who need a reproducible, scriptable charting tool.
- **Deliverable**: A CLI/SDK Python package that can be embedded into other applications or used standalone.

## Functional Scope
- Parse user-supplied datetime with timezone support.
- Determine the appropriate 局 (Yang/Yin dun, Ju number) based on calendar rules.
- Compute the 60 JiaZi stem-branch cycle and 八门/九星/八神 placements.
- Support multiple layouts (先天、后天) with option flags.
- Output:
  - Text-based chart for terminal.
  - Structured JSON for programmatic use.
- Optional: export to markdown/HTML templates after core logic is stable.

## Planned Architecture
- `main.py`: CLI entry point; argument parsing, IO orchestration.
- `qimen/`
  - `calendar.py`: Calendar utilities (solar term lookup, heavenly stems/earthly branches sequence, 节气 boundaries).
  - `chart.py`: Core chart calculation pipeline; returns a data model representing the 敦甲盘.
  - `layout.py`: Mapping logic for 宫位, 八门, 九星, 八神 placements.
  - `formatters.py`: Renderers for text/JSON/markdown outputs.
  - `models.py`: Data classes / TypedDicts describing chart elements.
- `tests/`: Pytest-based coverage for calendar edge cases and chart correctness snapshots.

## Data & References
- 内置常量 tables: 24 solar terms, stems/branches sequences, 九宫 templates.
- External ephemeris library (e.g., `astral`, `sxtwl`, or `skyfield`) evaluated for precise solar term calculations; default to `sxtwl` if license compatible.
- Document formula sources within module docstrings to maintain traceability.

## Roadmap
1. **Foundation**
   - Set up package structure, type checking (mypy), formatter (ruff/black).
   - Implement datetime parsing & validation.
2. **Calendar Core**
   - Solar term & 节气 boundary resolver.
   - Yin/Yang dun determination and 局数 computation.
3. **Chart Assembly**
   - Populate 九宫 grid with 八门/九星/天干/地支/神 based on selected template.
   - Support both 阳遁/阴遁 placements.
4. **Outputs**
   - Console renderer with ANSI-less layout.
   - JSON serializer mirroring internal data model.
5. **Quality**
   - Pytest coverage for sample datetimes (节气交界 cases, leap months).
   - Continuous integration workflow (GitHub Actions) once repo is public.

## Documentation Plan
- Update README with usage examples once CLI stabilizes.
- Provide a `/docs` folder containing:
  - Quick start guide.
  - Explanation of calculation rules and assumptions.
  - Glossary for key 奇门 concepts.

## Usage
```bash
python main.py --moment 2024-03-20T09:15:00 --timezone Asia/Shanghai
```

## Testing Strategy
- Unit tests for deterministic functions (stems/branches, palace rotations).
- Property-based tests for cyclical mappings (hypothesis).
- Regression fixtures with known historical charts to detect drift.

## Next Steps
- Scaffold package structure and dependency list in `pyproject.toml`.
- Evaluate available ephemeris/solar term libraries and select one.
- Draft initial calendar conversion utilities with placeholder constants, then replace with validated data sources.
