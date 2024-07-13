resource "aws_s3_bucket" "website-bucket" {
  bucket = var.s3_bucket_name
}

resource "aws_s3_bucket_policy" "website-policy" {
  bucket = aws_s3_bucket.website-bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource = [
          aws_s3_bucket.website-bucket.arn,
          "${aws_s3_bucket.website-bucket.arn}/*",
        ]
      },
    ]
  })
}

resource "aws_s3_bucket_website_configuration" "web_config" {
  bucket = aws_s3_bucket.website-bucket.bucket

  index_document {
    suffix = var.cloudfront_distribution_default_root_object # generally should be something like index.html
  }
}

resource "aws_s3_bucket_cors_configuration" "cors" {
  bucket = aws_s3_bucket.website-bucket.bucket

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}