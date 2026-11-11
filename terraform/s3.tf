resource "aws_s3_bucket" "kaleidoscope_media" {
  bucket = "kaleidoscope-media"
}

resource "aws_s3_bucket_policy" "kaleidoscope_media" {
  bucket = aws_s3_bucket.kaleidoscope_media.bucket
  policy = data.aws_iam_policy_document.kaleidoscope_media_bucket_policy.json
}

data "aws_iam_policy_document" "kaleidoscope_media_bucket_policy" {
  # listing applies to the bucket itself
  statement {
    sid       = "PublicListBucket"
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.kaleidoscope_media.arn]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
  }

  # reading applies to the objects inside it
  statement {
    sid       = "PublicGetObject"
    effect    = "Allow"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.kaleidoscope_media.arn}/*"]
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
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
