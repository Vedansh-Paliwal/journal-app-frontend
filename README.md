# 📒 Journal App — Frontend  
A simple and clean frontend interface for a personal journal application.  
Users can sign up, log in, create journal entries, update them, delete them, and manage their profile.

This frontend communicates with a Spring Boot backend using JWT authentication.

---

## 🚀 Features

### 🔐 Authentication
- User Signup  
- User Login  
- JWT stored in `localStorage`  
- Auto-redirect to login if token is missing  

### 📘 Journal Management
- Create new journal entries  
- View all entries  
- Update existing entries  
- Delete entries  
- Entries cached locally for faster update UI  

### 👤 User Profile
- Update username  
- Change password  
- Delete account  
- Password validation on frontend

### 🎨 UI/UX
- Fully responsive layout  
- Clean navbar with dropdown menus  
- Dynamic DOM rendering (no page reloads)  
- Error + success message handling

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla JS) |
| **Fonts** | Google Fonts (Poppins, Dancing Script) |
| **Auth** | JWT from backend |
| **Communication** | Fetch API (GET/POST/PUT/DELETE) |

---

## 📁 Folder Structure

Journal App/
│
├── HTML/
│ ├── index.html
│ ├── signup.html
│ └── journal.html
│
├── CSS/
│ ├── loginStyle.css
│ ├── signupStyle.css
│ ├── journalStyle.css
│ └── journalStyleDynamic.css
│
└── JS/
├── login.js
├── signup.js
└── journal.js


---

## 🔌 Backend API (Required)

This frontend expects a backend running at:

http://localhost:8080

Endpoints used:

POST /public/login
POST /public/signup
GET /journal
POST /journal
PUT /journal/id/{id}
DELETE /journal/id/{id}

GET /user
PUT /user
DELETE /user

Make sure CORS allows:

http://localhost:5500

---

## ▶️ Running the Frontend

No installations needed.

### Using Live Server (VS Code)
1. Install Live Server extension  
2. Right-click **index.html**  
3. Click **Open with Live Server**

---

## 🔒 Security Notes
- No secrets are stored on the frontend  
- JWT is stored in `localStorage`  
- Sensitive logic is enforced by backend (Spring Security + JWT)

---

## 📌 Future Improvements
- Client-side form validation enhancements  
- Real-time username availability check  
- Better error UI feedback  
- Dark mode (optional)  
- Deploy frontend + backend online

---

## 📄 License
This project is open-source. You can modify and use it freely for learning purposes.

---

If you like this frontend and you want the backend README as well, check the separate backend repository.