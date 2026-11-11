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

On load the page lists the whole media bucket (it takes a few seconds, since the list is paged 1000 keys at a time).

## How it works

- load a list of all files in the `kaleidoscope-media` bucket
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
