# Deployment Notes

## Confirmed Targets

- GitHub owner: `AlbertL97`
- Repository: `confai`
- Visibility: public
- Vercel team/account: `albertl97s-projects`
- Hosting: Vercel
- Database: Neon Postgres

## Verified URLs

- GitHub: [https://github.com/AlbertL97/confai](https://github.com/AlbertL97/confai)
- Vercel production: [https://confai-henna.vercel.app](https://confai-henna.vercel.app)
- Vercel deployment ID: `dpl_FNDVETdKF9yBwg2tsS8vDZtcxWqQ`

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

- [x] CI-equivalent local checks pass.
- [x] `npm run build` passes locally and on Vercel.
- [x] `npm run db:validate` passes.
- [ ] Neon `DATABASE_URL` is configured.
- [x] Vercel project is connected to `AlbertL97/confai`.
- [x] Daily refresh remains dry-run until idempotent writes are implemented.
- [x] No public admin route is exposed.
