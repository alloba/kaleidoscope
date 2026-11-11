# Kaleidoscope

This is a simple webpage that provides a "never-ending" stream of music/video files.
Very simply, it pulls from an S3 folder source, and inserts a random file from that source onto the page.
There are also very simple controls, like a next/previous button and a category picker.

The media files used in this project are not sourced by anything in this codebase.
They mainly come from the [Archivist](https://github.com/alloba/archivist) project,
with the remainder being manually added (very uncommon).

## Running Project

It's a static page with no build step. Serve `src/` with anything and open it:

```
cd src
python -m http.server 8000
# then visit http://localhost:8000
```

On load the page builds its media list from the per-folder indexes. Until archivist has published them (or for a folder
that has none) it pages through the S3 listing, 1000 keys at a time, which takes noticeably longer.

## How it works

- load the list of files: list the bucket's top-level folders (one request), then read the
  `.archivist-index.json` that archivist publishes in each folder (small, in parallel).
  A folder with no index is listed directly instead, and if the index path fails entirely the page falls back to
  listing the whole bucket. Archivist's `.archivist-*` files are never treated as media.
- organize them by top-level folder, plus an artificial `all` category
- provide a radio button for each category
- shuffle the selected category and play through it; files that fail to load are skipped

The bucket is public (the policy allows `s3:ListBucket` and `s3:GetObject`), so the page needs no AWS credentials.
Don't put any in this repo.

## Infrastructure and deploys

- `terraform/` defines the media bucket, plus the site bucket, CloudFront distribution and DNS record
  (`kaleidoscope.alexlbates.com`) via the `cloudfront-s3-site` module.
- GitHub Actions workflows (`.github/workflows/`):
  - `plan.yml` - `terraform plan` on pushes to master that touch `terraform/`, and on pull requests.
  - `apply.yml` - manual only. Review the plan first, then run this from the Actions tab.
  - `deploy-site.yml` - syncs `src/` to the site bucket on pushes that touch `src/`.
