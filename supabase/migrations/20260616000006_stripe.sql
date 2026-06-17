-- Allow Stripe as an oauth_connections provider (agency connects its Stripe account
-- via Connect OAuth; external_user_id stores the connected account id, e.g. acct_...).
alter type oauth_provider add value if not exists 'stripe';
