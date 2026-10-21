# TODO

## Secrets hardening

Remaining manual steps to scope deploy and signing secrets to the GitHub environment that uses them and rotate tokens. Current deploys keep working until the repo-level copies are deleted, so do the delete step last.

- [ ] Create a new Vercel token for `netflix-categories-chrome` only: Vercel Account Settings > Tokens > Create, scope it to the team that owns the project, and set an expiration date. Store it as `VERCEL_TOKEN` in the `Production` environment (Settings > Environments > Production > Environment secrets > Add environment secret).
- [ ] Copy `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` into the `Production` environment as environment secrets (the workflow reads them from `secrets.*`, so they cannot be variables). These are not sensitive: the Team ID is under Vercel Team Settings > General and each Project ID is under the Vercel project > Settings > General.
- [ ] Verify: run Actions > Vercel production > Run workflow on `main`. It redeploys the landing site (`apps/landing`) from the latest stable release in `Production`. Confirm the deploy finishes green.
- [ ] After the verification run passes, delete the repo-level copies of `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` under Settings > Secrets and variables > Actions > Repository secrets.
- [ ] Revoke the old Vercel token in Account Settings > Tokens once nothing else uses it.
