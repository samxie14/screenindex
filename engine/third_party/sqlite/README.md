# SQLite amalgamation

Place the official SQLite amalgamation files here:

1. Download **sqlite-amalgamation-*.zip** from:
   https://www.sqlite.org/download.html
   (Look for "C source code as an amalgamation" in the Source Code section)

2. Extract and copy into this folder:
   - `sqlite3.c`
   - `sqlite3.h`

Current version at time of setup: 3.51.3 (sqlite-amalgamation-3510300.zip)

## Command line (use the **.zip** URL, not sqlite.org homepage)

Do **not** use `curl -O https://www.sqlite.org` — that is HTML, not a zip, and `-O` has no filename → errors 23 / "Remote file name has no length".

```bash
cd third_party/sqlite   # from engine/

curl -fL -o sqlite-amalgamation.zip \
  "https://www.sqlite.org/2026/sqlite-amalgamation-3510300.zip"

unzip -o sqlite-amalgamation.zip
mv sqlite-amalgamation-3510300/sqlite3.c sqlite-amalgamation-3510300/sqlite3.h .
rm -rf sqlite-amalgamation-3510300 sqlite-amalgamation.zip
```

The zip lives under a **year** path on sqlite.org (e.g. `.../2026/...`); if that 404s after a new release, copy the amalgamation link from the download page.
