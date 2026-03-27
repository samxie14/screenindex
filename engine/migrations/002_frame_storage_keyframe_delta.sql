-- 002_frame_storage_keyframe_delta.sql
--
-- Pixel storage policy (application layer — not enforced by SQLite):
--
-- 1) storage_kind = 'full'
--    - Major change: app switch, new tab, large visual delta, periodic keyframe, etc.
--    - Set snapshot_path to a new full image on disk (JPEG/WebP/PNG).
--    - Leave delta_base_frame_id, delta_patch_path, duplicate_of_frame_id NULL.
--
-- 2) storage_kind = 'delta'
--    - Small change vs a chosen base: typing, small popup, minor UI change.
--    - delta_base_frame_id = row id of the image to decode first (often the previous
--      frame, OR the last keyframe if you only patch from keyframes — your pipeline
--      decides which).
--    - delta_patch_path = path to your binary patch artifact (bsdiff, custom tile
--      diff, etc.). snapshot_path NULL.
--    - Reconstruct: decode base frame to bitmap → apply patch → same size as base.
--
-- 3) storage_kind = 'duplicate'
--    - Pixel-identical to another row (hash match / skip capture file).
--    - duplicate_of_frame_id = that frame's id (usually points to a 'full' or prior
--      resolved row). snapshot_path NULL; no patch.
--
-- Embeddings / OCR still run on the *decoded* bitmap for that logical instant, even
-- when storage_kind is delta or duplicate.

ALTER TABLE frames ADD COLUMN storage_kind TEXT NOT NULL DEFAULT 'full';

ALTER TABLE frames ADD COLUMN delta_base_frame_id INTEGER REFERENCES frames(id) ON DELETE SET NULL;

ALTER TABLE frames ADD COLUMN delta_patch_path TEXT;

ALTER TABLE frames ADD COLUMN duplicate_of_frame_id INTEGER REFERENCES frames(id) ON DELETE SET NULL;
