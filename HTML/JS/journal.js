let journalCache = [];
/***********************
 *     API ENDPOINTS   *
 ***********************/

const URL_JOURNAL = "https://journal-app-backend-soa3.onrender.com/journal";
const URL_USER    = "https://journal-app-backend-soa3.onrender.com/user";


/***********************
 *   STATIC SELECTORS  *
 ***********************/

// --- Navbar ---
const hamburgerBtn = document.querySelector(".hamburger-btn");
const mobileMenu   = document.querySelector(".mobile-menu");
const navLogo      = document.querySelector(".nav-logo h2");
const homePage = document.querySelector(".home-btn");


// --- Desktop dropdown parents (PROFILE, SERVICES) ---
const dropdownParents = document.querySelectorAll(".dropdown-parent");

// --- Buttons that exist in BOTH desktop nav + mobile menu ---
const myJournalsBtns   = document.querySelectorAll(".my-journals-btn");
const newEntryBtns      = document.querySelectorAll(".new-entry-btn");
const editProfileBtns   = document.querySelectorAll(".edit-profile-btn");
const logoutBtns        = document.querySelectorAll(".logout-btn");

// --- Main sections (always exist in HTML) ---
const contentSection     = document.querySelector(".content");
const entriesSection     = document.querySelector(".entries");
const newEntrySection    = document.querySelector(".new-entry");
const editProfileSection = document.querySelector(".edit-profile");
const mainWrapper        = document.querySelector(".main");


/***********************
 *  HIDE ALL UI SECTIONS
 ***********************/
function hideAllSections() {

    // Hide all main sections
    document.querySelector(".content").style.display = "none";
    document.querySelector(".entries").style.display = "none";
    document.querySelector(".new-entry").style.display = "none";
    document.querySelector(".edit-profile").style.display = "none";

    // Clear dynamic content
    document.querySelector(".entries").innerHTML = "";
    document.querySelector(".new-entry").innerHTML = "";
    document.querySelector(".edit-profile").innerHTML = "";

    // Reset homepage content (ONLY if you want Home to show default text again)
    const contentDiv = document.querySelector(".content");
    contentDiv.innerHTML = `
        <h1>Welcome to Your Journal</h1>
        <p id="status">You can check all your entries here...</p>
    `;
}

function openMobileMenu(event) {
    event.stopPropagation();
    mobileMenu.classList.add("show");
    document.body.style.overflow = "hidden"; 
}

function closeMobileMenu() {
    mobileMenu.classList.remove("show");
    document.body.style.overflow = "auto";
}

function goHome() {
    hideAllSections();
    contentSection.style.display = "block";   // show welcome text
}

function attachGlobalEventListeners() {
    // Hamburger open & close
    hamburgerBtn.addEventListener("click", openMobileMenu);
    window.addEventListener("click", closeMobileMenu);

    // Prevent menu clicks from closing it
    mobileMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    // HOME button (logo)
    homePage.addEventListener("click", goHome);

    // Nav Logo
    navLogo.addEventListener("click", goHome);

    // Attach handlers to BOTH mobile + desktop menu buttons
    document.querySelectorAll(".my-journals-btn").forEach(el => {
        el.addEventListener("click", getJournalsList);
    });

    document.querySelectorAll(".new-entry-btn").forEach(el => {
        el.addEventListener("click", addNewEntry);
    });

    document.querySelectorAll(".edit-profile-btn").forEach(el => {
        el.addEventListener("click", editUserProfile);
    });

    document.querySelectorAll(".logout-btn").forEach(el => {
        el.addEventListener("click", logoutActiveUser);
    });
}

function logoutActiveUser() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

async function handleDelete(event) {
    const id = event.target.getAttribute("data-id");

    const confirmDelete = confirm("Are you sure you want to delete this entry?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const response = await fetch(`${URL_JOURNAL}/id/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.status === 204) {
        alert("Entry deleted successfully!");
        getJournalsList();
        return;
    }

    alert("Failed to delete entry.");
}

async function handleUpdate(event) {
    hideAllSections();

    const id = event.target.getAttribute("data-id");
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // Find entry in the cached list
    let entry = journalCache.find(e => e.id == id);

    if (!entry) {
        alert("Entry not found!");
        return;
    }

    const newEntryDiv = document.querySelector(".new-entry");
    newEntryDiv.style.display = "block";

    newEntryDiv.innerHTML = `
        <form class="entry-form">
            <h2>Update Entry</h2>

            <label for="title">Title</label>
            <input type="text" id="title" class="entry-input" required>

            <label for="content">Content</label>
            <textarea id="content" class="entry-textarea" required></textarea>

            <button type="submit" class="entry-submit-btn">Update Entry</button>
        </form>
    `;

    // Fill existing values
    newEntryDiv.querySelector(".entry-input").value = entry.title;
    newEntryDiv.querySelector(".entry-textarea").value = entry.content;

    // Attach update handler
    const form = newEntryDiv.querySelector(".entry-form");
    form.addEventListener("submit", (e) => saveUpdatedEntry(e, id));
}

async function getJournalsList() {
    hideAllSections();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // --- FETCH USER JOURNALS ---
    const response = await fetch(URL_JOURNAL, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    // Handle invalid token
    if ([401, 403, 500].includes(response.status)) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    if(response.status === 204) {
        document.querySelector(".content").style.display = "none";
        const entriesDiv = document.querySelector(".entries");
        entriesDiv.style.display = "block";
        entriesDiv.innerHTML = "<p>No journal entries available!</p>";
        return;
    }

    const data = await response.json();
    journalCache = data;

    const entriesDiv = document.querySelector(".entries");
    entriesDiv.style.display = "block";

    // Case: No entries
    if (response.status === 204) {
        entriesDiv.innerHTML = "<p>No journal entries available!</p>";
        return;
    }


    data.forEach(entry => {
        const date = entry.date.split("T")[0];

        const div = document.createElement("div");
        div.classList.add("entry");

        div.innerHTML = `
            <h3>${entry.title} (${date})</h3>
            <p>${entry.content}</p>
            <button class="delete-btn" data-id="${entry.id}">Delete</button>
            <button class="update-btn" data-id="${entry.id}">Update</button>
        `;

        entriesDiv.appendChild(div);

        // Attach handlers to newly created buttons
        div.querySelector(".delete-btn").addEventListener("click", handleDelete);
        div.querySelector(".update-btn").addEventListener("click", handleUpdate);
    });
}

async function saveEntryHandler(event) {
    event.preventDefault();  // prevent refresh

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const title = document.querySelector(".entry-input").value.trim();
    const content = document.querySelector(".entry-textarea").value.trim();

    if (!title || !content) {
        alert("Title and content cannot be empty!");
        return;
    }

    const response = await fetch(URL_JOURNAL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    });

    if ([401, 403, 500].includes(response.status)) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }

    if (!response.ok) {
        alert("Failed to create entry.");
        return;
    }

    // success → reload journals
    getJournalsList();
}

async function addNewEntry() {
    hideAllSections();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const newEntryDiv = document.querySelector(".new-entry");
    newEntryDiv.style.display = "block";

    newEntryDiv.innerHTML = `
        <form class="entry-form">
            <h2>Create New Entry</h2>

            <label for="title">Title</label>
            <input type="text" id="title" class="entry-input" required>

            <label for="content">Content</label>
            <textarea id="content" class="entry-textarea" required></textarea>

            <button type="submit" class="entry-submit-btn">Save Entry</button>
        </form>
    `;

    const form = newEntryDiv.querySelector(".entry-form");
    form.addEventListener("submit", saveEntryHandler);
}

async function saveUpdatedEntry(event, id) {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const newTitle = document.querySelector(".entry-input").value.trim();
    const newContent = document.querySelector(".entry-textarea").value.trim();

    if (!newTitle || !newContent) {
        alert("Title and content cannot be empty!");
        return;
    }

    const response = await fetch(`${URL_JOURNAL}/id/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: newTitle,
            content: newContent
        })
    });

    if (response.status === 404) {
        alert("Entry not found!");
        return;
    }

    if (!response.ok) {
        alert("Failed to update entry.");
        return;
    }

    alert("Entry updated successfully!");
    getJournalsList();
}

async function editUserProfile() {
    hideAllSections();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // 1️⃣ Fetch current user data
    const response = await fetch(URL_USER, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    const currentUsername = data.username;

    // 2️⃣ Show and build the form
    const editProfileDiv = document.querySelector(".edit-profile");
    editProfileDiv.style.display = "block";

    editProfileDiv.innerHTML = `
        <form class="edit-form">
            <div class="row1">
                <label>Username</label>
                <input type="text" class="username-input">
            </div>

            <div class="row1">
                <label>Password</label>
                <a href="#" class="change-pass-link">Change Password</a>
            </div>

            <div class="password-fields">
                <div class="row3">
                    <label>Old Password</label>
                    <input type="password" class="old-password">
                </div>
                <p class="old-password-error"></p>

                <div class="row3">
                    <label>New Password</label>
                    <input type="password" class="new-password">
                </div>

                <div class="row3">
                    <label>Retype New Password</label>
                    <input type="password" class="retype-password">
                </div>
                <p class="password-error"></p>
            </div>

            <div class="row2">
                <button type="submit" class="save-btn">Save Changes</button>
                <button type="button" class="delete">Delete Account</button>
            </div>

            <p class="success-message"></p>
        </form>
    `;

    // 3️⃣ Fill username
    editProfileDiv.querySelector(".username-input").value = currentUsername;

    // 4️⃣ Toggle password field visibility
    editProfileDiv.querySelector(".change-pass-link").addEventListener("click", (e) => {
        e.preventDefault();
        editProfileDiv.querySelector(".password-fields").classList.add("show");
    });

    // 5️⃣ Hook form submit → save profile function (next function)
    editProfileDiv.querySelector(".edit-form").addEventListener("submit", saveUserProfile);

    // 6️⃣ Hook delete account button (next function)
    editProfileDiv.querySelector(".delete").addEventListener("click", deleteUserAccount);
}

async function saveUserProfile(event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const editProfileDiv = document.querySelector(".edit-profile");

    const newUsername = editProfileDiv.querySelector(".username-input").value;
    const oldPassword = editProfileDiv.querySelector(".old-password").value;
    const newPassword = editProfileDiv.querySelector(".new-password").value;
    const retypePassword = editProfileDiv.querySelector(".retype-password").value;

    const oldPassError = editProfileDiv.querySelector(".old-password-error");
    const newPassError = editProfileDiv.querySelector(".password-error");
    const msg = editProfileDiv.querySelector(".success-message");

    // 1️⃣ Validate new password match
    if (newPassword || retypePassword) {  
        if (newPassword !== retypePassword) {
            newPassError.style.display = "block";
            newPassError.textContent = "New passwords do not match!";
            return;
        } else {
            newPassError.style.display = "none";
        }
    }

    // 2️⃣ Build request body (only send fields user is updating)
    const body = { username: newUsername };
    if (oldPassword) body.oldPassword = oldPassword;
    if (newPassword) body.newPassword = newPassword;

    // 3️⃣ Send update request
    const response = await fetch(URL_USER, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
    });

    // 4️⃣ Old password wrong?
    if (response.status === 400) {
        oldPassError.style.display = "block";
        oldPassError.textContent = "Old password is incorrect.";
        return;
    }

    // 5️⃣ Success
    msg.textContent = "Profile updated successfully!";
    msg.style.display = "block";

    setTimeout(() => {
        msg.style.display = "none";
        window.location.href = "index.html";
    }, 2000);
}

async function deleteUserAccount() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to delete your account? This cannot be undone!"
    );

    if (!confirmed) return;

    const response = await fetch(URL_USER, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.status === 204) {
        localStorage.removeItem("token");
        alert("Account deleted successfully!");
        window.location.href = "signup.html";
    } else {
        alert("Failed to delete account.");
    }
}

attachGlobalEventListeners();