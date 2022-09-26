# Hacktoberfest Tracking Dashboard

A fun, over-engineered SPA to replace E-g's internal Hacktoberfest Participant Tracker Google doc. Live production app is hosted here: https://hacktoberfest-tracking.vercel.app/

## Technology Summary

- [Supabase](https://supabase.com/)
- [Svelte](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
- [Vercel](https://vercel.com/)

Using [VS Code](https://code.visualstudio.com/) with the [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) extension is recommended.

## Contributing

Open issues can be found [here](https://github.com/ubercj/hacktoberfest-tracking/issues). If you see an issue you'd like to tackle, please comment on the issue first to signal your intent and make sure two people don't end up working on the same issue without knowing.

Just clone the repo, make a feature branch and submit a PR with your changes. Chris will give it a review before merging. If you have any questions, you can email or Slack Chris at his E-g email.

### Environment Variables

You'll need a few environment variables set in a `.env` file before you can start development in order to connect to Supabase, etc. Get in touch with Chris via Slack or email and he'll give you what you need.

### Supabase permissions

Supabase uses a postgres database - if you would like to make a contribution that involves adding tables, changing schemas, or anything else that involves database changes, you'll need to be able to log in to the Supabase project dashboard. Get in touch with Chris for the login credentials.
