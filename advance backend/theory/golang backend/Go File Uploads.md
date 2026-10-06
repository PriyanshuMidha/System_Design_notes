# Go File Uploads

## What to build

Allow users to upload invoice PDFs, contracts, and payment proof.

## Endpoint idea

```text
POST /invoices/{id}/attachments
```

## Backend flow

1. authenticate user
2. authorize invoice/workspace
3. limit request size
4. parse multipart form
5. validate file type and size
6. generate safe storage key
7. store file locally or object storage
8. save metadata in DB
9. return attachment id/url

## Security checklist

- do not trust original filename
- validate content type/extension
- size limit
- virus scan in real production if needed
- private files should not be public URLs by default
- signed URLs for downloads

## Connect to notes

- [[File Upload Architecture]]
- [[Go Security for Backend]]
- [[AWS S3]]

## Coding task

Build local-disk upload first with metadata table. Later replace storage implementation with S3-style adapter.
