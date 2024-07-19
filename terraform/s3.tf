resource "aws_s3_bucket" "kaleidoscope_media" {
  bucket = "kaleidoscope-media"
}

resource "aws_s3_bucket_policy" "kaleidoscope_media" {
  bucket = aws_s3_bucket.kaleidoscope_media.bucket
  policy = data.aws_iam_policy_document.kaleidoscope_media_bucket_policy.json
}

data "aws_iam_policy_document" "kaleidoscope_media_bucket_policy" {
  statement {
    sid    = "test-statement"
    actions = ["s3:ListBucket"]
    effect = "Allow"
    principals {
      type = "AWS"
      identifiers = ["*"]
    }
    resources = [
      aws_s3_bucket.kaleidoscope_media.arn,
      "${aws_s3_bucket.kaleidoscope_media.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_cors_configuration" "kaleidoscope_media_cors" {
  bucket = aws_s3_bucket.kaleidoscope_media.bucket
  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    allowed_headers = ["*"]
  }
}
