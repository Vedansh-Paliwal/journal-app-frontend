# 📒 Journal App — Responsive Frontend (2025 Update)

A fully responsive and user-friendly frontend for a personal journal application.  
Supports authentication, journal management, and profile editing — all powered by a Spring Boot backend using JWT security.

This version includes a complete **responsive redesign**, supporting both **desktop dropdown navigation** and **mobile hamburger navigation**.

---

## 🚀 Features

### 🔐 Authentication  
- User Signup  
- User Login  
- JWT saved in `localStorage`  
- Auto-redirects to login if token is missing or invalid  

---

## 📘 Journal Management
- View all journal entries  
- Create new entries  
- Update entries  
- Delete entries  
- Clean, card-based UI  
- Responsive layout  
- Dynamic DOM rendering (no page reloads)  
- Local caching for faster UI interactions  

---

## 👤 User Profile
- Edit username  
- Change password (section expands only when requested)  
- Delete account  
- Frontend validation for:
  - Password mismatch  
  - Incorrect old password  
- Smooth error/success messages  

---

## 📱💻 Responsive UI/UX

### **Mobile View**
- Hamburger menu  
- Slide-in full-screen navigation  
- Touch-friendly layout  
- Forms automatically stretch for readability  

### **Desktop View**
- Navbar with hover dropdown menus  
- Multi-section layout  
- Journals displayed in wider cards  
- Centered forms with max-width  
- Buttons positioned cleanly (e.g., bottom-right for entries)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Backend** | Spring Boot (JWT Auth, MongoDB Atlas) |
| **Deployment** | Netlify (frontend), Render (backend via Docker) |
| **Icons** | Font Awesome |
| **Fonts** | Google Fonts (Poppins, Dancing Script) |
| **Communication** | Fetch API (GET, POST, PUT, DELETE) |

---

## 🔗 Backend API (Production)

Base URL:

```
https://journal-app-backend-soa3.onrender.com
```

### Public Endpoints  
```
POST /public/login
POST /public/signup
GET  /public/health-check
```

### Journal Endpoints  
```
GET    /journal
POST   /journal
PUT    /journal/id/{id}
DELETE /journal/id/{id}
```

### User Endpoints  
```
GET    /user
PUT    /user
DELETE /user
```

All private endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔧 Local Development API (When using Live Server)

Backend local URL:

```
http://localhost:8080
```

CORS must allow:

```
http://localhost:5500
http://127.0.0.1:5500
```

---

## 📁 Folder Structure

```
Journal App/
│
├── HTML/
│   ├── index.html
│   ├── signup.html
│   └── journal.html
│
├── CSS/
│   ├── loginStyle.css
│   ├── signupStyle.css
│   ├── journalStyle.css
│   └── journalStyleDynamic.css
│
└── JS/
    ├── login.js
    ├── signup.js
    └── journal.js
```

---

## ▶️ Running the Frontend

### **Using VS Code Live Server**
1. Install the **Live Server** extension  
2. Right-click `index.html`  
3. Select **Open with Live Server**  

This runs at:

```
http://127.0.0.1:5500/
```

Alternatively deploy using:
- Netlify  
- GitHub Pages  
- Vercel  

---

## 🌍 Deployment Information

### Backend  
- **Platform:** Render  
- **Runtime:** Docker (multi-stage build)  
- **Database:** MongoDB Atlas  
- **Status:** ✔️ Live and stable  

### Frontend  
- **Platform:** Netlify  
- **Status:** Deployment update pending  

A **live demo URL** will be added after Netlify deployment.

---

## 🔒 Security Notes
- No secrets stored on the frontend  
- JWT stored in `localStorage` (simple project approach)  
- All auth & authorization enforced by backend  
- CORS configured correctly for both local + production  
- Unauthorized users instantly redirected  

---

## 📌 Future Improvements  
- Better UI animations  
- Real-time username availability check  
- Dark/Light mode toggle  
- Export journals as PDF  
- Rich text editor  
- Activity history / timeline  

---

## 📄 License  
This project is open-source. Feel free to modify and use it for learning or portfolio building.