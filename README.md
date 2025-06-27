# 🌊 Project DeepWave — hack-enshmirtz HACKATHON PROJECT 🚀

> **Predicting Tsunamis🌊Made Easy — with an Interactive NASA Earth Globe**

---

## 🌐 What is DeepWave?

**DeepWave** is a web app that aims to help researchers, disaster-response teams, and curious users **predict tsunami risk at any coastal location**.
It combines:

✅ A *machine learning model* that predicts tsunami likelihood from coordinates  
✅ An *interactive 3D globe* so users can **visually choose the precise location** instead of manually searching for latitude and longitude  

Our mission:

> **"Making critical geolocation data entry accessible, for when needed, to save the world, one predict at at ime :)"**
# *Note to our hackathon judges* -
✅ Last Feature Friday, we submitted our ML model (91% Accuracy)...This friday we have worked on our Frontend of our website. The backend and frontend integration of the ML model is in progress and planned for the next sprint!
✅ Please do scroll the page for our **special note for the judges**, and do go through our entire read me, it should give an idea of how we hav created this globe :))

## 📸 Experience Our Website

> 👉 **Click the image below to watch our demo video!**  
> *(Or use the live link just below it to test it yourself.)*

[![Watch the demo](https://github.com/user-attachments/assets/9e1c9ab7-6898-435c-9586-94dcd2d22803)](https://youtu.be/ak2QTYkNcWU)

---

## 🔗 Live Link
https://project-deepwave.vercel.app/


---

## 🌟 About the Site

DeepWave is built to **predict tsunami risk** based on precise geographic coordinates.
Instead of making users look up latitude and longitude manually (which is error-prone and tedious), our **Interactive Globe** lets them:

✅ Spin, zoom, and explore the Earth in 3D  
✅ Click exactly where they want to test  
✅ Instantly see the exact coordinates

These coordinates will be **passed to our tsunami prediction ML model**, which returns a risk score.

---

# 🌊 Special Notes for Hackathon Reviewers

⭐️ Our standout feature for *Feature Friday* is our **InteractiveGlobe** component:

✅ Lets users **click** anywhere on Earth to get **precise WGS84 latitude/longitude**  
✅ Uses **NASA's 4K real Earth imagery** for accurate visual reference  
✅ Adds a **gentle bounce animation** when clicking so users know exactly where they clicked  
✅ **Coordinates are instantly shown** and *can be directly fed into our tsunami prediction model* (integration planned)

> This approach removes the need for users to search for coordinates on Google Maps or copy-paste them manually. Instead, it **makes location selection part of an enjoyable, immersive experience.**

---

## ⚡️ How it Connects to Tsunami Prediction

- The *core idea* of our site is to **predict tsunami probability** at any coastal location.  
- Our **ML model** (developed separately) takes **latitude and longitude** as inputs to generate predictions.  
- The globe ensures **users don't have to manually type or look up coordinates**.  
- It’s not just functional—it’s *engaging*, encouraging exploration and understanding of coastal geography.

✅ *Note*: Frontend integration of the ML model is in progress and planned for the next sprint!

---

## 🚀 Quick Start

**Use your preferred IDE and follow these steps:**

# 1️⃣ Clone this repo
git clone <YOUR_GIT_URL>

# 2️⃣ Go to the project folder
cd wavefront

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev
🌍 Core Features
✅ Interactive 3D Earth using NASA imagery
✅ Click to get precise latitude and longitude (WGS84 system)
✅ Smooth bounce animation centered on click location
✅ Real-time coordinate display with intuitive UI
✅ Built with modern tools (Vite, React, TypeScript, Tailwind, shadcn-ui)
✅ Mobile-friendly and responsive

🌌 Why This Globe is Special
This isn’t just a static 3D model. The heart of our app is matching a user's click on Earth to real-world coordinates, while:

✅ Handling globe rotation and orientation with rotation matrices
✅ Mapping 3D sphere points to latitude/longitude correctly
✅ Using high-resolution NASA Blue Marble textures for realism
✅ Creating a custom bounce animation with sinusoidal vertex displacement — no pre-baked animation!

✨ Highlights of the Implementation
🎯 Click-to-Coordinate Mapping
Normalizes 3D click points to sphere surface

Applies inverse rotation to get true geographic location

Converts to:

ini
Copy
Edit
lat = arcsin(y / radius)
lng = atan2(z, x)
Normalizes to standard WGS84 longitude range

🌐 NASA Satellite Textures
Diffuse Map: Real Earth imagery

Normal Map: Terrain topography

Specular Map: Realistic ocean reflections

🏀 Bounce Animation
Real-time vertex displacement near click

Smooth sinusoidal easing

Lasts ~1.5 seconds, resets cleanly

Works regardless of globe rotation

🛰️ Realistic Lighting
Ambient, directional, and point lights

Star field backdrop for immersion

Realistic shading and reflections

💡 Example User Flow
1️⃣ User explores the globe by dragging and zooming
2️⃣ Clicks on the target coastal region
3️⃣ Instantly sees latitude and longitude
4️⃣ (In the next version, those coordinates will be automatically passed to the ML model to get a tsunami risk score!)

🗺️ Example Coordinates
Region	Approximate Lat	Approximate Lng
India	~21° N	~78° E
USA	~40° N	~-100° W
Australia	~-27° S	~133° E

⚙️ Built With
⚡ Vite – Fast dev server

⚛️ React – UI framework

🟦 TypeScript – Type safety

🎨 Tailwind CSS – Utility-first styling

🪄 shadcn/ui – Beautiful components

🌌 Three.js – 3D rendering

