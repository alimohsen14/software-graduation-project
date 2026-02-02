---
description: How to update or replace the Google Drive hosted 3D model
---

# 3D Model Management (Google Drive)

This workflow explains how to manage the externally hosted 3D model for the Palestine 3D website.

## Current Setup

The 3D model is hosted on **Google Drive** and loaded directly in the browser.

**Model URL:**
```
https://drive.google.com/uc?export=download&id=1GD4fq4lpi6lMxEZ_9JgFLeI50La3qfn_
```

**Location in code:**
- File: `src/components/soap3d/hero/Soap3DModelViewer.tsx`
- Line: ~19

---

## How to Update the 3D Model

### Step 1: Upload New Model to Google Drive

1. Create/export your new `.glb` model file
2. Upload it to Google Drive
3. Right-click the file → **Share** → Set permissions to **"Anyone with the link"**
4. Copy the sharing link (will look like: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`)

### Step 2: Convert to Direct Download URL

Transform the sharing link to a direct download URL:

**From:**
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

**To:**
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

### Step 3: Update the Code

1. Open `src/components/soap3d/hero/Soap3DModelViewer.tsx`
2. Find the `modelSrc` constant (around line 19)
3. Replace the URL with your new direct download URL

**Example:**
```typescript
// ✅ Google Drive hosted 3D model (works for all devices)
const modelSrc = "https://drive.google.com/uc?export=download&id=YOUR_NEW_FILE_ID";
```

### Step 4: Test Locally

```bash
npm run dev
```

1. Navigate to the 3D viewer page
2. Verify the model loads correctly
3. Check all hotspots and interactions work
4. Test on mobile (responsive view)

### Step 5: Deploy to Vercel

```bash
git add .
git commit -m "Update 3D model to new version"
git push
```

Vercel will automatically deploy the changes.

---

## Benefits of Google Drive Hosting

✅ **No local files** - Keeps repository small  
✅ **Easy updates** - Just replace the file in Google Drive  
✅ **No build size impact** - Model is loaded externally  
✅ **Fast deployment** - No need to upload large files to Vercel  

---

## Alternative: Use a Different CDN

If you prefer a different hosting solution (e.g., AWS S3, Cloudflare R2, Azure Blob), simply:

1. Upload the `.glb` file to your CDN
2. Get the public URL
3. Replace the `modelSrc` value in `Soap3DModelViewer.tsx`

**Requirements:**
- URL must be publicly accessible
- CORS must be enabled for cross-origin requests
- Direct file access (not a download page)

---

## Troubleshooting

### Model doesn't load
- Check if the Google Drive link is public (Anyone with the link)
- Verify the URL format is: `https://drive.google.com/uc?export=download&id=FILE_ID`
- Check browser console for CORS errors

### Model loads slowly
- Google Drive has bandwidth limits
- Consider using a dedicated CDN for better performance
- Compress the `.glb` file to reduce size

### Model looks different
- Ensure the model uses the same coordinate system
- Check that animations are named correctly (e.g., "Door_Open")
- Verify materials and textures are embedded in the `.glb` file

---

## Cleanup (Optional)

The old local model files still exist in `public/models/`:
- `soap-factory.glb`
- `soap-factory1.glb`

These are **no longer used**. You can safely delete them:

```bash
rm public/models/soap-factory.glb
rm public/models/soap-factory1.glb
```

Or keep them as backups.
