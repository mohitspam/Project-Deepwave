
# 🌊 Project DeepWave - HACKATHON PROJECT

- Featuring our Interactive NASA Earth Globe with precise coordinate mapping and real-time bounce effects.

Wavefront is a React + Three.js project that features an **interactive 3D globe** using real NASA Blue Marble textures. Users can **click anywhere on Earth to get real-world geographic coordinates** with beautiful animated feedback.

---
### ⭐️ special Notes for Hackathon Reviewers - our special componenet for Feature Friday - is our #Interactive Globe 
- Gives Precise co-ordinates of the place where you click using your cursor
- 

* This project places **special emphasis** on *interactive mapping* of user clicks to **real-world coordinates**, and demonstrating **real-time 3D feedback** with NASA textures.
* Please enjoy the "bounce" at the place you touch it :P
* The bounce animation is fully dynamic, computed in real-time on the mesh geometry without relying on any pre-baked animations.
* The code is well-commented and easy to extend for features like data overlays, weather layers, or space views.


## 🚀 Quick Start

**Use your preferred IDE and follow these steps:**

```bash
# 1️⃣ Clone this repo
git clone <YOUR_GIT_URL>

# 2️⃣ Go to the project folder
cd wavefront

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev
```

---

## 🌍 Core Features

✅ Interactive 3D Earth using NASA imagery
✅ Click to get real latitude and longitude (WGS84 system)
✅ Smooth bounce animation centered on click location
✅ Real-time coordinate display with stylish UI
✅ Fully responsive, mobile-friendly design
✅ Built with modern tools (Vite, React, TypeScript, Tailwind, shadcn-ui)

---



## 🌌 Why This Globe is Special

This isn't just a static 3D model. The heart of this project is **matching a user's 3D click to real geographic coordinates**, while ensuring:

* ✅ Correct **longitude/latitude mapping** despite globe rotation
* ✅ Accounting for the globe's **current orientation** with inverse rotation math
* ✅ Applying real NASA Blue Marble textures for **immersive realism**
* ✅ Creating a **bounce animation** that deforms the sphere mesh dynamically at the exact click location

**Challenges overcome:**

* Mapping 3D sphere click points to geographic coordinates required handling rotation matrices to reverse the globe's rotation.
* Latitude/longitude math uses spherical geometry, arcsin, atan2 conversions, and normalization to \[-180, 180] ranges.
* Textures loaded asynchronously with smooth fallback states and loading spinners.
* Bounce effect: sinusoidal displacement of nearby vertices based on distance to click, with custom easing for realistic deformation.

---

## ✨ Highlights of the Implementation

### 🎯 Click-to-Coordinate Mapping

When a user clicks the globe:

* The 3D click point is **normalized** to the sphere surface.
* A **rotation matrix** is applied to counteract the current rotation of the globe.
* The corrected point is converted to **latitude and longitude** with:

  ```
  lat = arcsin(y / radius)
  lng = atan2(z, x)
  ```
* Values are normalized to standard WGS84 ranges.

### 🌐 NASA Satellite Textures

High-resolution, realistic textures are loaded:

* **Diffuse Map:** Real Earth imagery
* **Normal Map:** Topography bumps
* **Specular Map:** Ocean reflections

This ensures **photorealism** without sacrificing performance.

### 🏀 Bounce Animation

* Custom shader-free **vertex displacement**.
* Vertices near the click "bounce" outward with sinusoidal easing.
* The bounce lasts 1.5 seconds, resets cleanly, and works at any rotation.

### 🛰️ Realistic Lighting

* Ambient light for subtle illumination.
* Directional and point lights to mimic sun and space reflections.
* Star field backdrop for extra immersion.

---

## 📸 Screenshots

> *(Add images here if you have them!)*

* Interactive globe with NASA textures.
* Bounce animation at clicked location.
* Coordinate readout panel.

---

## ⚙️ Built With

* ⚡ [Vite](https://vitejs.dev/) – Blazing fast dev server
* ⚛️ [React](https://react.dev/) – UI framework
* 🟦 [TypeScript](https://www.typescriptlang.org/) – Type safety
* 🎨 [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
* 🪄 [shadcn/ui](https://ui.shadcn.com/) – Beautiful components
* 🌌 [Three.js](https://threejs.org/) – 3D rendering
* 🛸 @react-three/fiber – React integration for Three.js

---

## 💡 How to Use

1️⃣ **Run the app** (see Quick Start).
2️⃣ **Rotate / Zoom:** Drag and scroll to explore.
3️⃣ **Click anywhere:** See the latitude and longitude.
4️⃣ **Watch the bounce:** The globe deforms at your click location with a beautiful animation.

---

## 🗺️ Example Coordinates

| Region    | Approximate Lat | Approximate Lng |
| --------- | --------------- | --------------- |
| India     | \~21° N         | \~78° E         |
| USA       | \~40° N         | \~-100° W       |
| Australia | \~-27° S        | \~133° E        |

---

## 🤝 Contributing

Feel free to fork, clone, and submit pull requests!

---

## 📜 License

MIT License

---

## 👨‍💻 Author

[Your Name](https://github.com/yourusername)

---


---

## 🔗 Links

* [Live Demo (if deployed)](https://your-deployed-app.com)
* [GitHub Repository](https://github.com/yourusername/wavefront)

---

**Enjoy exploring Earth! 🌍✨**
