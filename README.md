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
- Auto-protects private pages (redirects to login if token is missing)

---

## 📘 Journal Management
- View all journal entries  
- Create new entries  
- Update entries  
- Delete entries  
- Clean, card-based UI  
- Fully responsive layout  
- Dynamic DOM rendering (no page reloads)

---

## 👤 User Profile
- Edit username  
- Change password (toggle section appears only when requested)  
- Delete account  
- Frontend validation for:
  - Password mismatch  
  - Incorrect old password  
- Success/error feedback messages

---

## 📱💻 Responsive UI/UX

### **Mobile View**
- Hamburger menu  
- Full-screen slide-in navigation  
- Touch-friendly UI  
- Forms stretch to 100% width for readability  

### **Desktop View**
- Clean navbar with dropdown menus  
- Hover-activated dropdowns  
- Journals displayed in wider cards  
- Forms centered with max-width  
- Buttons repositioned (bottom-right for entries)

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **Fonts** | Google Fonts (Poppins, Dancing Script) |
| **Icons** | Font Awesome |
| **Auth** | JWT (stored in localStorage) |
| **Communication** | Fetch API |

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

## 🔌 Backend API Dependency

This frontend expects a backend running at:

```
http://localhost:8080
```

Endpoints used:

### **Authentication**
```
POST /public/signup
POST /public/login
```

### **Journal**
```
GET    /journal
POST   /journal
PUT    /journal/id/{id}
DELETE /journal/id/{id}
```

### **User**
```
GET    /user
PUT    /user
DELETE /user
```

CORS must allow:

```
http://localhost:5500
```

(or your Netlify domain after deployment)

---

## ▶️ Running the Frontend

### **Using VS Code Live Server**
1. Install Live Server extension  
2. Right-click `index.html`  
3. Choose **Open with Live Server**  

Or deploy using:
- Netlify  
- GitHub Pages  
- Vercel  

---

## 🔒 Security Notes
- No secrets are stored on the frontend  
- JWT is kept in `localStorage`  
- Sensitive operations validated by backend  
- Auto-redirect prevents unauthorized access to journal.html  

---

## 🚀 Future Improvements
- Better UI animations (delete/update)  
- Improved empty-state visuals  
- Dark mode  
- Backend deployment for full-stack online hosting  
- Real-time username validation  

---

## 📄 License
This project is open-source. You may modify and use it for learning or personal projects.

