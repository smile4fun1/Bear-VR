# 🥽 Servi VR Diagnostics Platform

**WebXR-based diagnostic and collaboration platform for Servi robots with real-time telemetry visualization and multi-user support.**

Built with Next.js, React Three Fiber, WebXR, and Socket.io.

---

## ✨ Features

- 🥽 **Full WebXR Support** - Works on Meta Quest 3, desktop VR, and browsers
- 🤖 **Real-time Robot Telemetry** - Battery, position, velocity, sensors, network status
- 👥 **Multi-user Collaboration** - Viewer and controller roles with live presence
- 📝 **3D Spatial Annotations** - Place notes in 3D space for team communication
- 💻 **VR Terminal** - Execute ROS 2 commands directly in VR
- 🗺️ **Map Editor** - Visualize and edit waypoints, obstacles, and paths
- 🎮 **VR Controls** - Full hand tracking and controller support
- 🌍 **Multiple Environments** - Lab, warehouse, restaurant, office presets
- 🔄 **Live Simulation** - ROS 2 data simulator (ready for real robot integration)
- ⚡ **Optimized Performance** - Smooth 72Hz+ on Quest 3

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Servi 3D Model

1. Go to [Luma AI](https://lumalabs.ai/)
2. Upload 20-40 photos of Servi from all angles
3. Export as **GLB format**
4. Place `servi.glb` in `public/models/`

> **Note**: A placeholder robot will show if the model is not found.

### 3. Run Development Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser or Quest 3 browser.

### 4. Enter VR Mode

Click the **"VR"** button (appears when WebXR is detected).

---

## 📱 Testing on Meta Quest 3

1. Make sure your Quest and dev machine are on the same network
2. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Run: `npm run dev`
4. On Quest Browser, navigate to: `http://YOUR_IP:3000`
5. Click **VR** button to enter immersive mode

---

## 🎮 Controls

### Desktop Mode
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan camera
- **Scroll** - Zoom in/out
- **Click UI panels** - Interact with settings

### VR Mode
- **Controller Triggers** - Select/Interact
- **Hand Tracking** - Pinch to select
- **Thumbsticks** - Teleport/Navigate
- **Grip Buttons** - Grab objects

---

## 🔧 Configuration

### Connect to Real ROS 2 Robot

Edit `lib/ros-simulator.ts` and replace with:

```typescript
import ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
  url: 'ws://YOUR_ROBOT_IP:9090'
});

// Subscribe to topics
const odomTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/robot/odom',
  messageType: 'nav_msgs/Odometry'
});

odomTopic.subscribe((message) => {
  // Update telemetry with real data
});
```

### Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_ROS_WS_URL=ws://192.168.1.100:9090
NEXT_PUBLIC_APP_NAME=Servi VR Diagnostics
```

---

## 📦 Project Structure

```
servi-vr/
├── app/
│   ├── api/socket/          # Socket.io API route
│   ├── page.tsx             # Main page
│   └── layout.tsx           # App layout
├── components/
│   ├── VRScene.tsx          # Main WebXR scene
│   ├── ServiRobot.tsx       # 3D robot model
│   ├── Telemetry.tsx        # Telemetry dashboard
│   ├── Terminal.tsx         # VR terminal
│   ├── Annotations.tsx      # 3D annotations
│   ├── MapEditor.tsx        # Map visualization
│   └── VRInterface.tsx      # Settings and controls
├── lib/
│   ├── store.ts             # Zustand state management
│   ├── socket.ts            # Socket.io client
│   ├── ros-simulator.ts     # ROS 2 data simulator
│   └── types.ts             # TypeScript types
├── public/models/           # 3D models (add servi.glb here)
└── server.js                # Custom Socket.io server
```

---

## 🌐 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Configure build:

```bash
# Build Command
npm run build

# Install Command  
npm install

# Output Directory
.next
```

4. Add custom server for Socket.io:

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

> **Note**: Vercel Serverless has limitations with WebSocket. For production multi-user, use Heroku, Railway, or DigitalOcean.

### Alternative: Railway.app (Recommended for WebSocket)

1. Connect GitHub repo
2. Railway auto-detects Next.js
3. Add environment variable: `PORT=3000`
4. Deploy ✅

---

## 🎨 Customization

### Change Robot Colors

Edit `components/ServiRobot.tsx`:

```typescript
<meshStandardMaterial color="#YOUR_COLOR" />
```

### Add New Environments

Edit `components/VRInterface.tsx` and add to dropdown:

```typescript
<option value="custom">Custom Environment</option>
```

Then add environment preset in `components/VRScene.tsx`.

### Modify Telemetry Display

Edit `components/Telemetry.tsx` to add/remove data fields.

---

## 🐛 Troubleshooting

### WebXR Not Working on Quest

- Make sure you're using **HTTPS** or **localhost**
- Quest Browser must be updated to latest version
- Enable WebXR in browser settings

### Socket.io Not Connecting

- Check firewall settings
- Ensure port 3000 is open
- Verify network connectivity

### Model Not Loading

- Verify `servi.glb` is in `public/models/`
- Check browser console for errors
- Model must be GLB format (not GLTF with separate files)

### Performance Issues

- Lower shadow quality in settings
- Reduce environment complexity
- Disable grid if not needed
- Check Quest battery level (performance throttles when low)

---

## 🔮 Roadmap

- [ ] Real ROS 2 integration with rosbridge
- [ ] Video streaming from robot cameras
- [ ] Path planning visualization
- [ ] Voice commands in VR
- [ ] Mobile companion app
- [ ] SLAM visualization
- [ ] Collaborative debugging sessions
- [ ] AR mode for mobile devices
- [ ] Analytics dashboard
- [ ] Recording and playback

---

## 📄 License

MIT License - feel free to use for your robotics projects!

---

## 🙋 Support

Issues? Ideas? Open a GitHub issue or PR.

**Built with ❤️ for the robotics community**

