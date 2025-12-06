let journalCache = [];
const parents = document.querySelectorAll(".dropdown-parent");
let myJournals = document.querySelector(".my-journals-btn");
let newEntry = document.querySelector(".new-entry-btn");
let newEntryDiv = document.querySelector(".new-entry");
let editProfile = document.querySelector(".edit-profile-btn");

URL_JOURNAL = "http://localhost:8080/journal";
URL_USER = "http://localhost:8080/user";

function hideAllSections() {
    // Hide the four main UI sections
    document.querySelector(".content").style.display = "none";
    document.querySelector(".entries").style.display = "none";
    document.querySelector(".new-entry").style.display = "none";
    document.querySelector(".edit-profile").style.display = "none";

    // Clear dynamic content so old UI does not remain visible
    document.querySelector(".entries").innerHTML = "";
    document.querySelector(".new-entry").innerHTML = "";
    document.querySelector(".edit-profile").innerHTML = "";

    // The main wrapper stays visible after login
    document.querySelector(".main").style.display = "block";
}

window.onload = () => { // = “Run this only after the HTML is fully loaded.”, Not using window.onload = Sometimes JS runs before HTML exists → errors. You can only select an element in JS if that element already exists in the HTML at the time JS runs.
    let tokenValue = localStorage.getItem("token");
    const header = document.querySelector(".header");
    const main = document.querySelector(".main");
    let logoutBtn = document.querySelector(".logout-btn");

    logoutBtn.addEventListener("click", function(){
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    if (!tokenValue) {
        window.location.href = "index.html";
        return;
    }
    header.style.display = "block";
    main.style.display = "flex";
};

// Open/close dropdown when clicking on parent
parents.forEach(parent => {
    parent.addEventListener("click", function (event) {
        event.stopPropagation(); // stopPropagation() prevents a click on dropdown from also triggering the “click outside” logic.

        const dropdown = parent.querySelector(".dropdown");

        // Close any other open dropdowns
        document.querySelectorAll(".dropdown.show").forEach(openDropdown => {
            if (openDropdown !== dropdown) openDropdown.classList.remove("show");
        });

        // Toggle this dropdown
        dropdown.classList.toggle("show"); // If class exists → remove it  |  If class doesn’t exist → add it
    });
});

// Close dropdowns when clicking anywhere else
window.addEventListener("click", () => {
    document.querySelectorAll(".dropdown.show").forEach(openDropdown => {
        openDropdown.classList.remove("show");
    });
});

handleDelete = async (event) => {

    const id = event.target.getAttribute("data-id");

    const confirmed = confirm("Are you sure you want to delete this journal entry?");

    if(!confirmed) {
        return;
    }

    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "index.html";
        return;
    }

    const response = await fetch(`${URL_JOURNAL}/id/${id}`, {
        method : "DELETE",
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });

    if(response.status === 204) {
        alert("Entry deleted successfully!");
        getJournalsList();
    }
    else {
        alert("Failed to delete entry!");
    }
}

saveUpdatedEntry = async (event, id) => {

    event.preventDefault();

    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "index.html";
        return;
    }

    let newTitle = document.querySelector(".entry-input").value;
    let newContent = document.querySelector(".entry-textarea").value;

    const response = await fetch(`${URL_JOURNAL}/id/${id}`, {
        method : "PUT",
        headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${token}`
        },
        body : JSON.stringify({
            "title" : newTitle,
            "content" : newContent
        })
    });

    if(response.status === 404) {
        alert("Entry not found!");
        return;
    }

    if(response.status === 200) {
        alert("Entry updated successfully!");
        getJournalsList();
    }
}

handleUpdate = async (event) => {

    hideAllSections();

    const id = event.target.getAttribute("data-id");

    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "index.html";
        return;
    }

    let entry = null;

    for(let i = 0;i < journalCache.length; i++) {
        if(journalCache[i].id === id) {
            entry = journalCache[i];
            break;
        }
    }

    if(!entry) {
        alert("Entry not found!");
        return;
    }

    newEntryDiv.style.display = "block";
    newEntryDiv.innerHTML = `
        <form class="entry-form">
            <h2>Update Entry</h2>

            <label for="title">Title</label>
            <input type="text" id="title" class="entry-input" required>

            <label for="content">Content</label>
            <textarea id="content" class="entry-textarea" required></textarea>

            <button type="submit" class="entry-update-btn">Update Entry</button>
        </form>
    `;

    document.querySelector(".entry-input").value = entry.title;
    document.querySelector(".entry-textarea").value = entry.content;

    const form = document.querySelector(".entry-form");
    form.addEventListener("submit", (e) => saveUpdatedEntry(e, id));
}

getJournalsList = async () => {

    hideAllSections();
    document.querySelector(".edit-profile").style.display = "none";

    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "index.html";
        return;
    }
    const response = await fetch(URL_JOURNAL, {
        method : "GET",
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });

    if(response.status === 401 || response.status === 403 || response.status === 500) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }
    if(response.status === 204) {
        document.querySelector(".content").style.display = "none";
        const entriesDiv = document.querySelector(".entries");
        entriesDiv.innerHTML = "<p>No journal entries available!</p>";
        return;
    }
    
    const data = await response.json();
    journalCache = data;

    const entriesDiv = document.querySelector(".entries");
    entriesDiv.style.display = "block";
    
    data.forEach(entry => {
        const date = entry.date.split("T")[0];
        const content = entry.content;
        const title = entry.title;
        
        const div = document.createElement("div");
        div.classList.add("entry");
        
        const h3 = document.createElement("h3");
        h3.textContent = `${title} (${date})`;
        
        const p = document.createElement("p");
        p.textContent = content;

        const deleteBtn = document.createElement("button"); 
        deleteBtn.textContent = "Delete"; 
        deleteBtn.classList.add("delete-btn"); 
        deleteBtn.setAttribute("data-id", entry.id);

        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.classList.add("update-btn");
        updateBtn.setAttribute("data-id", entry.id);
        
        div.appendChild(h3);
        div.appendChild(p);
        div.appendChild(deleteBtn);
        div.appendChild(updateBtn);

        entriesDiv.appendChild(div);

        deleteBtn.addEventListener("click", handleDelete);
        updateBtn.addEventListener("click", handleUpdate);
    })
}

async function saveEntryHandler(event) {
    event.preventDefault(); // prevent page refresh

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const title = newEntryDiv.querySelector(".entry-input").value;
    const content = newEntryDiv.querySelector(".entry-textarea").value;

    const response = await fetch(URL_JOURNAL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // This header tells Spring Boot: “The body I’m sending you is JSON. Please parse it as JSON.”
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            title: title,
            content: content
        })
    });
    if (response.status === 401 || response.status === 403 || response.status === 500) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
        return;
    }
    if (!response.ok) {
        alert("Something went wrong while creating the entry.");
        return;
    }

    // SUCCESS → Load My Journals page again
    getJournalsList();
}

addNewEntry = async () => {

    hideAllSections();
    const token = localStorage.getItem("token");
    
    if(!token) {
        window.location.href = "index.html";
        return;
    }

    newEntryDiv.style.display = "block";

    newEntryDiv.innerHTML = `
    <form class="entry-form">
        <h2>Create New Entry</h2>

        <label for="title">Title</label>
        <input type="text" id="title" class="entry-input" placeholder="Enter title" required>

        <label for="content">Content</label>
        <textarea id="content" class="entry-textarea" placeholder="Write your journal entry..." required></textarea>

        <button type="submit" class="entry-submit-btn">Save Entry</button>
    </form>
    `;

    const form = newEntryDiv.querySelector(".entry-form");
    form.addEventListener("submit", saveEntryHandler);
}

editUserProfile = async () => {

    hideAllSections();

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    // 1️⃣ Fetch current user profile
    const response = await fetch(URL_USER, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    const data = await response.json();
    const currentUsername = data.username;

    // 2️⃣ Show Edit Profile Section
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

            <div class="password-fields" style="display:none;">
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

    // Fill username field
    editProfileDiv.querySelector(".username-input").value = currentUsername;

    // 3️⃣ Toggle password field
    editProfileDiv.querySelector(".change-pass-link").addEventListener("click", () => {
        editProfileDiv.querySelector(".password-fields").style.display = "flex";
    });

    // 4️⃣ Delete Account
    editProfileDiv.querySelector(".delete").addEventListener("click", async () => {
        const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone!");

        if (!confirmed) return;

        const response = await fetch(URL_USER, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.status === 204) {
            localStorage.removeItem("token");
            alert("Account Deleted Successfully!");
            window.location.href = "signup.html";
        }
    });

    // 5️⃣ Save Changes
    editProfileDiv.querySelector(".edit-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const newUsername = editProfileDiv.querySelector(".username-input").value;
        const oldPassword = editProfileDiv.querySelector(".old-password").value;
        const newPassword = editProfileDiv.querySelector(".new-password").value;
        const retypePassword = editProfileDiv.querySelector(".retype-password").value;

        const passwordError = editProfileDiv.querySelector(".password-error");
        const oldPassError = editProfileDiv.querySelector(".old-password-error");

        // 6️⃣ Validate new password match
        if (newPassword !== retypePassword) {
            passwordError.style.display = "block";
            passwordError.textContent = "New passwords do not match!";
            return;
        } else {
            passwordError.style.display = "none";
        }

        // 7️⃣ Send update request
        const res = await fetch(URL_USER, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                username: newUsername,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        });

        if (res.status === 400) {
            oldPassError.style.display = "block";
            oldPassError.textContent = "Old password is incorrect.";
            return;
        }

        // 8️⃣ Success
        const msg = editProfileDiv.querySelector(".success-message");
        msg.textContent = "Profile updated successfully!";
        msg.style.display = "block";

        setTimeout(() => {
            msg.style.display = "none";
            window.location.href = "index.html";
        }, 3000);
    });
};

myJournals.addEventListener("click", getJournalsList);
newEntry.addEventListener("click", addNewEntry);
editProfile.addEventListener("click", editUserProfile);