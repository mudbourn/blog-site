-- Daily orphaned-reaction purge, spec 8.4
-- Deletes reactions at least 30 days old whose surface is no longer active.
-- Track reactions have no persistent surface row, so they fall through to the
-- age check on the same 30-day clock.

SELECT cron.schedule(
  'purge-orphaned-reactions',
  '0 3 * * *',
  $$
  DELETE FROM reactions
  WHERE created_at < NOW() - INTERVAL '30 days'
    AND NOT EXISTS (
      SELECT 1 FROM media_blocks WHERE id::text = reactions.surface_id AND is_published = TRUE
      UNION ALL
      SELECT 1 FROM statuses     WHERE id::text = reactions.surface_id AND is_live = TRUE
      UNION ALL
      SELECT 1 FROM exhibitions  WHERE id::text = reactions.surface_id AND status = 'open'
    );
  $$
);
