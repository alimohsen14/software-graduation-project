---
description: How to update or replace the GitHub Release hosted 3D model
---

# 3D Model Management (GitHub Releases)

This workflow explains how to manage the externally hosted 3D model for the Palestine 3D website using GitHub Releases, which provides superior performance and CORS support for WebGL.

## Current Setup

The 3D model is hosted as a **GitHub Release Asset** and loaded directly in the browser.

**Model URL:**
```
https://github.com/alimohsen14/software-graduation-project/releases/download/v1.0-model-2/soap-factory.glb
```

**Location in code:**
- File: `src/components/soap3d/hero/Soap3DModelViewer.tsx`
- Line: ~19

---

## How to Update the 3D Model

### Step 1: Export New Model
1. Create/export your new `.glb` model file.
2. Ensure animations (like `Door_Open`) and materials are embedded.

### Step 2: Upload to GitHub Releases
1. Go to your GitHub repository: [software-graduation-project](https://github.com/alimohsen14/software-graduation-project).
2. Go to **Releases** → **Draft a new release** (or edit an existing one).
3. Upload your `.glb` file to the "Assets" section.
4. **Publish** the release.

### Step 3: Get the Direct URL
1. In the Release view, right-click your uploaded asset and select **Copy Link Address**.
2. It should look like: `https://github.com/USER/REPO/releases/download/TAG/FILENAME.glb`

### Step 4: Update the Code
1. Open `src/components/soap3d/hero/Soap3DModelViewer.tsx`.
2. Find the `modelSrc` constant (around line 19).
3. Replace the URL with your new GitHub Release URL.

**Example:**
```typescript
// ✅ High-performance GitHub Release URL (CORS enabled, supports large files)
const modelSrc = "https://github.com/alimohsen14/software-graduation-project/releases/download/v2.0/new-soap-factory.glb";
```

### Step 5: Verify & Deploy
1. Run `npm run start` and verify the model loads instantly.
2. Check that the build succeeds: `npm run build`.
3. Push changes to trigger a Vercel deployment.

---

## Technical Benefits
✅ **CORS Supported**: GitHub naturally allows cross-origin requests for release assets.
✅ **Large File Handling**: Supports files > 100MB without virus scan interstitials.
✅ **Fast Byte-Range Requests**: Allows `<model-viewer>` to stream the model efficiently.
✅ **CDN Performance**: Globally distributed by GitHub's infrastructure.

---

## Troubleshooting

### Model loads to 100% but doesn't appear
- Ensure you used a **Release Asset URL**, not a blob URL from the main code browser.
- Verify the file is a valid `.glb` (try uploading to [glTF Viewer](https://gltf-viewer.donmccurdy.com/)).

### Build fails on Vercel
- Check that `CI=false` is set in your build command (as we just updated in `package.json`).
- Ensure no Vite-specific `import.meta.env` remains in the code.
