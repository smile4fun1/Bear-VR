# 📸 Luma AI 3D Model Creation Guide

Complete guide to creating a perfect Servi 3D model using Luma AI.

---

## 🎯 Goal

Create a photorealistic GLB model of Servi robot for WebXR visualization.

---

## 📋 What You Need

- **Photos**: 20-40 high-quality images from all angles
- **Luma AI Account**: Free tier works perfectly
- **Time**: 5-15 minutes processing

---

## 📸 Photo Shooting Guide

### Setup

1. **Location**
   - Good, even lighting (avoid harsh shadows)
   - Simple background (solid color wall ideal)
   - Clear floor space to walk around Servi
   - Remove clutter from background

2. **Camera**
   - Smartphone camera works great
   - DSLR even better
   - Enable HDR if available
   - Turn off flash

3. **Servi Preparation**
   - Clean visible dirt/smudges
   - Remove any temporary attachments
   - Ensure all parts visible
   - If possible, place on lazy susan or turntable

### Shooting Pattern

**Method 1: Orbital (Recommended)**

Walk around Servi in 3 orbital rings:

1. **Low orbit** (waist height)
   - Start at 0°
   - Take photo every 15-20°
   - Complete 360° circle
   - ~18-24 photos

2. **Mid orbit** (chest height)  
   - Same as above
   - ~18-24 photos

3. **High orbit** (above head)
   - Angle camera down ~30°
   - Complete circle
   - ~12-18 photos

**Total: 48-66 photos**

**Method 2: Lazy Susan (If Available)**

1. Place Servi on turntable
2. Set camera on tripod
3. Take photo, rotate 15°, repeat
4. Change camera height
5. Repeat at 3 heights

### Critical Angles

Must-have shots:

- ✅ Front (0°)
- ✅ Left (90°)
- ✅ Back (180°)
- ✅ Right (270°)
- ✅ All 4 corners (45°, 135°, 225°, 315°)
- ✅ Top-down view
- ✅ Close-up of wheels
- ✅ Close-up of sensors/cameras
- ✅ Close-up of shelves/trays

### Photo Quality Checklist

- [ ] All photos in focus (no motion blur)
- [ ] Consistent lighting across all shots
- [ ] Entire robot visible in frame
- [ ] 20-30% overlap between adjacent photos
- [ ] No fingers/reflections in frame
- [ ] Background stays constant
- [ ] High resolution (at least 1920x1080)

---

## 🚀 Upload to Luma AI

### Step 1: Sign Up

1. Go to https://lumalabs.ai/
2. Click "Sign Up"
3. Use Google/Email
4. Free tier is sufficient

### Step 2: Create Capture

1. Click **"New Capture"**
2. Choose **"Upload Photos"**
3. Give it a name: "Servi Robot Model"

### Step 3: Upload Photos

1. Select all 20-40 photos
2. Wait for upload (may take a few minutes)
3. Don't close browser during upload

### Step 4: Configure

**Settings**:
- **Capture Type**: Object
- **Background**: Auto (Luma will remove it)
- **Quality**: High
- **Resolution**: High (if available in your plan)

Click **"Start Processing"**

### Step 5: Wait

- Processing takes 5-15 minutes typically
- You'll get an email when done
- Can close browser and come back

---

## 📦 Download Model

### Step 1: Review

1. Open your processed capture
2. Check quality in 3D viewer
3. Look for:
   - All sides captured
   - No missing geometry
   - Clean edges
   - Proper texture alignment

### Step 2: Export

1. Click **"Export"** button
2. Choose format: **GLB** (not GLTF!)
3. Settings:
   - **File Type**: GLB (Binary)
   - **Include Textures**: Yes
   - **Polygon Count**: Medium (50-100k triangles recommended)
   - **Texture Size**: 2048x2048

4. Click **"Export"**
5. Download will start

### Step 3: Install

1. Rename downloaded file to `servi.glb`
2. Move to your project: `public/models/servi.glb`
3. Refresh your browser
4. Model should load automatically! 🎉

---

## 🎨 Model Optimization (Optional)

If model is too large or slow:

### Use Blender (Free)

1. Download Blender: https://blender.org
2. Import GLB: `File > Import > glTF 2.0`
3. Reduce geometry:
   - Select mesh
   - Add "Decimate" modifier
   - Set ratio to 0.5 (50% polygons)
4. Compress textures:
   - Open Shading workspace
   - Select texture nodes
   - Resize to 1024x1024
5. Export: `File > Export > glTF 2.0`
   - Format: GLB
   - Include textures
   - Enable Draco compression

### Use gltf-pipeline (CLI)

```bash
npm install -g gltf-pipeline

# Optimize
gltf-pipeline -i servi.glb -o servi-optimized.glb -d
```

---

## 🔍 Quality Checklist

Your final model should:

- [ ] File size < 50MB (ideally < 20MB)
- [ ] Loads in < 5 seconds on Quest 3
- [ ] No missing textures
- [ ] Proper scale (not tiny or huge)
- [ ] Clean geometry (no artifacts)
- [ ] 60 FPS in VR scene

---

## 🐛 Troubleshooting

**Model is too dark**
- Increase exposure in Luma AI export settings
- Adjust materials in Blender
- Add more lights to VR scene

**Missing parts**
- Retake photos of missing areas
- Create new capture with more photos
- Ensure all angles covered

**Model is too big (file size)**
- Use Draco compression
- Reduce texture size to 1024x1024
- Decimate geometry in Blender

**Model wrong size in VR**
- Edit `ServiRobot.tsx`
- Change scale: `<primitive object={model.scene} scale={0.5} />`
- Adjust scale value to fit (0.5 = 50% size)

**Textures look wrong**
- Make sure you exported as GLB (not GLTF with separate files)
- Check "Include Textures" was enabled
- Try re-exporting from Luma

**Model won't load**
- Check file is named exactly `servi.glb` (lowercase)
- Verify it's in `public/models/` directory
- Check browser console for errors
- Try opening GLB in https://gltf-viewer.donmccurdy.com/

---

## 📏 Expected Results

Good Servi model specs:

- **File Size**: 10-30 MB
- **Polygons**: 50,000-150,000
- **Texture Size**: 2048x2048 or 4096x4096
- **Format**: GLB (binary)
- **Load Time**: 2-8 seconds

---

## 🎓 Advanced: Using Measurements

If you have precise measurements of Servi:

1. Create scale reference:
   - Place a ruler or measuring tape in photos
   - Or use a known-size object (soda can, etc.)

2. In Blender after import:
   - Measure model
   - Scale to match real dimensions
   - Servi is typically ~0.8m × 1.2m × 1.0m (W × L × H)

---

## 🆚 Alternative: Polycam

If Luma AI doesn't work well:

1. Download Polycam app (iOS/Android)
2. Use "Object Capture" mode
3. Follow in-app instructions to scan
4. Export as GLB
5. Place in `public/models/servi.glb`

**Pros**: More control, mobile scanning  
**Cons**: Requires LiDAR (iPhone Pro/iPad Pro)

---

## 💡 Pro Tips

1. **More photos = better quality** (up to ~100 photos)
2. **Consistent lighting** is more important than perfect lighting
3. **Overlap** between photos ensures good reconstruction
4. **Clean background** helps Luma isolate the subject
5. **Multiple captures** - try again if first attempt isn't perfect
6. **Test early** - check model in VR before final optimization

---

## 📚 Resources

- Luma AI: https://lumalabs.ai/
- Blender: https://blender.org
- glTF Viewer: https://gltf-viewer.donmccurdy.com/
- Polycam: https://poly.cam/

---

**Questions?** Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)!

