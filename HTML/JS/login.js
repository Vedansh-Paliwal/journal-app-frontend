let submitForm = document.querySelector("form");
let usernameInput = document.querySelector(".form-group .username");
let passwordInput = document.querySelector(".form-group .password");
let usernameError = document.querySelector(".form-group .user");
let passwordError = document.querySelector(".form-group .pass");
const URL = "https://journal-app-backend-soa3.onrender.com/public/login";


const submitData = async (event) => {

    event.preventDefault();

    usernameError.style.display = "none";
    passwordError.style.display = "none";

    let username = usernameInput.value;
    let password = passwordInput.value;

    username = username.trim();
    password = password.trim();

    if((username === "" || username === null) && (password === "" || password === null)) {
        usernameError.textContent = "Username cannot be empty!";
        usernameError.style.display = "block";
        passwordError.textContent = "Password cannot be empty!";
        passwordError.style.display = "block";
        return;
    }
    if(username === "" || username === null) {
        usernameError.textContent = "Username cannot be empty!";
        usernameError.style.display = "block";
        return;
    }
    if(password === "" || password === null) {
        passwordError.textContent = "Password cannot be empty!";
        passwordError.style.display = "block";
        return;
    }

    try {
        const response = await fetch(URL, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                "username":username,
                "password":password
            })
        });
        if (!response.ok) {
            alert("Incorrect username or password! Please try again");
            window.location.href = "index.html";
            return;
        }
        const token = await response.text();
        localStorage.setItem("token", token); /* Think of localStorage as a small built-in storage box inside your browser. Can store around 5MB per website. How long does localStorage last?
        Until YOU (or your code) delete it.
        This means:
            ✔ Closing tab → data stays
            ✔ Closing browser → data stays
            ✔ Restarting laptop → data stays
            ✔ Opening in new tab → data stays
            ✔ Visiting another page → data stays
        localStorage never expires automatically.
        It survives everything. Is is nothing but just key–value pairs, which can be accessed by localStorage.getItem("token");
        CON:
            LocalStorage is accessible by JavaScript
            So if someone injects malicious JS (XSS), token can be stolen
        For real production, we would use:
            HttpOnly cookies
            SameSite policies
            Secure cookie
        */
       window.location.href = "journal.html";
       // The browser interprets this as: “Load journal.html from the SAME folder as the current file.”
    }
    catch(error) {
        console.log(error);
    }
}


const nameinputMessage = () => {
    usernameError.style.display = "none";
}
const passinputMessage = () => {
    passwordError.style.display = "none";
}

submitForm.addEventListener("submit", submitData);
usernameInput.addEventListener("input", nameinputMessage);
passwordInput.addEventListener("input", passinputMessage);