-- WearOn Platform — Support automation
-- A seller-editable FAQ/policy blurb (returns, exchanges, shipping times) fed
-- into the shared agent's context so it can answer support questions itself
-- instead of every non-sales query needing a human. intent columns for
-- sales/support/other tagging already exist on instagram_messages and
-- whatsapp_messages as of 006_whatsapp_and_channels.sql.

alter table tenant_config add column if not exists faq_policy text;
