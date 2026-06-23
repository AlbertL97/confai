# Deployment Notes

## Confirmed Targets

- GitHub owner: `AlbertL97`
- Repository: `confai`
- Visibility: public
- Vercel team/account: `albertl97s-projects`
- Hosting: Vercel
- Database: Neon Postgres

## Environment Variables

Set these in Vercel and GitHub Actions secrets:

```bash
DATABASE_URL="postgresql://..."
REFRESH_MODE="dry-run"
CONFIDENCE_THRESHOLD="high"
```

`REFRESH_MODE` should remain `dry-run` until parser fixtures, source-policy review, and idempotent database writes are implemented and tested.

## GitHub Actions Schedule

GitHub scheduled workflows use UTC cron. The daily refresh workflow runs at `08:00` and `09:00` UTC and gates the actual refresh by `Europe/Warsaw` local hour, so the job executes when the local hour is `10`.

Operational caveat: GitHub documents that scheduled workflows can be delayed or dropped during high load and only run on the default branch. The workflow uploads a run summary artifact for observability.

## Production Release Gate

Before production deployment:

- CI passes.
- `npm run build` passes.
- `npm run db:validate` passes.
- Neon `DATABASE_URL` is configured.
- Vercel project is connected to `AlbertL97/confai`.
- Daily refresh remains dry-run or has verified idempotent writes.
- No public admin route is exposed without authentication.
