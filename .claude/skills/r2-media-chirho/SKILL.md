# For God so loved the world, that He gave His only begotten Son,
# that all who believe in Him should not perish but have everlasting life.
# — John 3:16

# R2 Media Storage Skill

Best practices for storing and managing media files in Cloudflare R2.

## Bucket Configuration

| Setting | Value |
|---------|-------|
| **Bucket** | `global-bible-tools-media-chirho` |
| **Custom Domain** | `https://media-global-tools.bible.systems` |

## Credentials

Use environment variables from `.env`:
```bash
LOVEJESUS_R2_KEY_CHIRHO       # Access Key ID
LOVEJESUS_R2_SECRET_CHIRHO    # Secret Access Key
LOVEJESUS_R2_ENDPOINT_CHIRHO  # S3-compatible endpoint
CLOUDFLARE_GLOBAL_API_MAIN_ACCOUNT_ID_CHIRHO  # Account ID for wrangler
```

Zone ID for `bible.systems` domain can be retrieved via Cloudflare API or dashboard.

## Upload Best Practices

### Use rclone for Large Files
AWS CLI multipart uploads can fail with SSL errors on large files. rclone is more reliable:

```bash
# Set environment
export RCLONE_CONFIG_R2_TYPE="s3"
export RCLONE_CONFIG_R2_PROVIDER="Cloudflare"
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$LOVEJESUS_R2_KEY_CHIRHO"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$LOVEJESUS_R2_SECRET_CHIRHO"
export RCLONE_CONFIG_R2_ENDPOINT="$LOVEJESUS_R2_ENDPOINT_CHIRHO"

# Upload with retries and smaller chunks
rclone copy large-file.pdf r2:global-bible-tools-media-chirho/bibles-chirho/ \
  --s3-chunk-size 5M \
  --retries 5 \
  --low-level-retries 10 \
  -v
```

### File Organization
```
global-bible-tools-media-chirho/
├── bibles-chirho/           # Interlinear PDFs
│   ├── interlinear-eng-chirho.pdf
│   ├── interlinear-spa-rv1909-chirho.pdf
│   └── ...
├── audio-chirho/            # Future audio files
└── images-chirho/           # Future images
```

### Naming Convention
- Use kebab-case with `-chirho` suffix
- Include language code: `interlinear-{lang}-{reference}-chirho.pdf`
- Examples:
  - `interlinear-swa-swhulb-chirho.pdf` (Swahili with swhulb reference)
  - `interlinear-eng-kjv-chirho.pdf` (English with KJV reference)

## Domain Management

### Add Custom Domain
```bash
wrangler r2 bucket domain add global-bible-tools-media-chirho \
  --domain media-global-tools.bible.systems \
  --zone-id 3cab657fc8306aa056ef21dd8d7ad0a4 \
  --force
```

### Check Domain Status
```bash
wrangler r2 bucket domain list global-bible-tools-media-chirho
```

SSL provisioning takes a few seconds after adding a domain.

## Access URLs

Files are accessible at the custom domain:
```
https://media-global-tools.bible.systems/bibles-chirho/<filename>
```

## Cache Behavior

R2 automatically provides:
- `cache-control: max-age=14400` (4 hours)
- Proper `etag` headers for conditional requests
- `last-modified` timestamps

### Cache Busting
For updated files with same name, use:
1. Versioned filenames: `file-v2-chirho.pdf`
2. Query parameters: `file-chirho.pdf?v=2`

## DO NOT

- **Don't create Workers** for serving R2 files - use native public access
- **Don't use wrangler for large uploads** - it times out; use rclone/AWS CLI
- **Don't store credentials in code** - always use environment variables
- **Don't upload without content-type** - PDFs need `application/pdf`

## Troubleshooting

### SSL Errors During Upload
Use smaller chunk sizes with rclone:
```bash
--s3-chunk-size 5M
```

### 403 Forbidden on Custom Domain
SSL certificate is still provisioning. Wait 30 seconds and retry.

### Files Not Accessible
Ensure public access is enabled:
```bash
wrangler r2 bucket dev-url enable global-bible-tools-media-chirho
```
