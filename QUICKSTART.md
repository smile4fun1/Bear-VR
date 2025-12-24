# 🚀 Quick Start Guide

Get Servi VR running in 5 minutes.

---

## Step 1: Install

```bash
npm install
```

---

## Step 2: Run

```bash
npm run dev
```

Server starts at **http://localhost:3000**

---

## Step 3: Access on Quest 3

### Option A: Same Network
1. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On Quest Browser: `http://YOUR_IP:3000`

### Option B: USB Link (Quest Link)
1. Enable Quest Link
2. Open browser: `http://localhost:3000`

---

## Step 4: Add Your Servi Model

### Using Luma AI (Recommended)

1. Go to https://lumalabs.ai/
2. Sign up (free tier available)
3. Click "New Capture"
4. Upload 20-40 photos of Servi:
   - Walk around Servi in a circle
   - Take photos every 15-20 degrees
   - Include top, middle, and bottom angles
   - Good lighting is important
   - Avoid motion blur
5. Wait for processing (5-15 minutes)
6. Download as **GLB** format
7. Rename to `servi.glb`
8. Place in `public/models/servi.glb`
9. Refresh browser

### Alternative: Using Polycam

1. Download Polycam app (iOS/Android)
2. Use "Object Capture" mode
3. Scan Servi following app instructions
4. Export as GLB
5. Place in `public/models/servi.glb`

### What Photos to Take

**Essential shots**:
- Front, back, left, right (straight on)
- 45° angles from all corners
- Top-down view
- Bottom view (if accessible)
- Close-ups of sensors, wheels, shelves

**Pro tips**:
- Use consistent lighting
- Avoid shadows
- Keep background simple
- Take more photos than you think you need
- Overlap between photos helps reconstruction

---

## Step 5: Enter VR

1. Click **VR** button (bottom-left)
2. Put on Quest 3 headset
3. Use controllers or hand tracking to interact

---

## 🎮 Basic Controls

### Desktop
- **Left Click + Drag** = Rotate
- **Right Click + Drag** = Pan  
- **Scroll** = Zoom

### VR
- **Trigger** = Select
- **Grip** = Grab
- **Thumbstick** = Move

---

## 🔧 Quick Settings

Click **⚙️ Settings** button in VR to:
- Change environment (Lab/Warehouse/Restaurant/Office)
- Toggle grid, axes, telemetry
- Adjust shadow quality
- Show/hide terminal and map

---

## 📝 Try These Features

1. **Open Terminal** - Click "💻 Terminal" button
   - Try: `ros2 topic list`
   - Try: `ros2 topic echo /robot/odom`

2. **Add Annotation** - Click "📝 Annotate"
   - Type a note
   - Click "Add"
   - See it in 3D space at robot position

3. **View Map** - Click "🗺️ Map"
   - See waypoints and obstacles
   - Add new waypoint at current robot position

4. **Watch Telemetry** - Auto-shown on left side
   - Battery percentage
   - Position and velocity
   - Sensor status
   - Network info

---

## 🤝 Multi-User Mode

To test collaboration:

1. Open in two browsers (or Quest + desktop)
2. Each gets unique color and ID
3. See other users in space
4. Share annotations in real-time

---

## ⚡ Performance Tips

If laggy on Quest 3:

1. Open Settings
2. Set Shadow Quality to "Low"
3. Disable "Show Grid"
4. Close Terminal when not using
5. Charge Quest (performance throttles at low battery)

---

## 🐛 Troubleshooting

**"VR button doesn't appear"**
- Use HTTPS or localhost
- Update Quest Browser to latest
- Try Quest Browser (not Firefox/Chrome on Quest)

**"Can't connect from Quest"**
- Check both devices on same WiFi
- Disable firewall temporarily
- Try IP address instead of localhost

**"Model not loading"**
- Check file is named `servi.glb` (not `servi.gltf`)
- File must be in `public/models/` directory
- Check browser console for errors

**"Socket.io won't connect"**
- Make sure you're running with `npm run dev` (not `npm run dev:next`)
- Port 3000 must be available
- Check terminal for errors

---

## 🔜 Next Steps

- Connect to real ROS 2 robot (see README.md)
- Customize robot colors and materials
- Add more telemetry data fields
- Deploy to Vercel/Railway

---

**Need help?** Check the full [README.md](./README.md) or open an issue!

