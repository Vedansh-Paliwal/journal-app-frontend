let journalCache = [];
const parents = document.querySelectorAll(".dropdown-parent");
let myJournals = document.querySelector(".my-journals-btn");
let newEntry = document.querySelector(".new-entry-btn");
let newEntryDiv = document.querySelector(".new-entry");
let editProfile = document.querySelector(".edit-profile-btn");

URL_JOURNAL = "http://localhost:8080/journal";
URL_USER = "http://localhost:8080/user";

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

    header.classList.add("show-header");
    main.classList.add("show-main");
};

parents.forEach(parent => {
    parent.addEventListener("mouseenter", function() {
        const dropdown = parent.querySelector(".dropdown");
        dropdown.style.display = "block";
    });
    parent.addEventListener("mouseleave", () => {
        const dropdown = parent.querySelector(".dropdown");
        dropdown.style.display = "none";
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

    document.querySelector(".content").style.display = "none";
    document.querySelector(".entries").style.display = "none";

    const newEntryDiv = document.querySelector(".new-entry");
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
    // hide the create-new-entry form and clear it
    newEntryDiv.style.display = "none";
    newEntryDiv.innerHTML = "";

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
    document.querySelector(".content").style.display = "none";

    const entriesDiv = document.querySelector(".entries");
    entriesDiv.style.display = "block";
    entriesDiv.innerHTML = "";
    document.querySelector(".main").style.display = "block";
    
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

    const title = document.querySelector(".entry-input").value;
    const content = document.querySelector(".entry-textarea").value;

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
    const token = localStorage.getItem("token");
    
    if(!token) {
        window.location.href = "index.html";
        return;
    }
    
    document.querySelector(".edit-profile").style.display = "none";
    document.querySelector(".content").style.display = "none";
    document.querySelector(".entries").style.display = "none";
    document.querySelector(".main").style.display = "block";

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

    const form = document.querySelector(".entry-form");
    form.addEventListener("submit", saveEntryHandler);
}

editUserProfile = async () => {

    const token = localStorage.getItem("token");

    if(!token) {
        window.location.href = "index.html";
        return;
    }

    document.querySelector(".content").style.display = "none";
    document.querySelector(".entries").style.display = "none";
    document.querySelector(".new-entry").style.display = "none";
    document.querySelector(".main").style.display = "block";

    const response1 = await fetch(`${URL_USER}`, {
        method : "GET",
        headers : {
            "Authorization" : `Bearer ${token}`
        }
    });

    const data = await response1.json();
    const userName = data.username;

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
    `
    const delBtn = document.querySelector(".delete");
    delBtn.addEventListener("click", async function() {
        const token = localStorage.getItem("token");
        if(!token) {
            window.location.href = "index.html";
            return;
        }
        const confirmed = confirm("Are you sure you want to delete your account? All information will be lost forever!");
        
        if(!confirmed) {
            return;
        }
        
        const response = await fetch(`${URL_USER}`, {
            method : "DELETE",
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        });

        if(response.status === 204) {
            localStorage.removeItem("token");
            alert("Account Deleted Successfully!");
            window.location.href = "signup.html";
            return;
        }
        else if(response.status === 401 || response.status === 403) {
            window.location.href = "login.html";
            return;
        }
    });

    document.querySelector(".username-input").value = userName;
    const changePassword = document.querySelector(".change-pass-link");
    changePassword.addEventListener("click", function() {
        document.querySelector(".password-fields").style.display = "flex";
    });

    const form = document.querySelector(".edit-form");

    form.addEventListener("submit", async function(event) {

        event.preventDefault();

        let newPassword = document.querySelector(".new-password").value;
        let retypedPassword = document.querySelector(".retype-password").value;

        let errorP = document.querySelector(".password-error");

        if (newPassword !== retypedPassword) {
            errorP.style.display = "block";
            errorP.innerText = "New Password and Retyped Password don't match!";
            return; // STOP HERE
        } 
        else {
            errorP.style.display = "none";
        }
        let newUsername = document.querySelector(".username-input").value;
        let oldPassword = document.querySelector(".old-password").value;
        // After validation passes → send PUT request
        const response2 = await fetch(`${URL_USER}`, {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            body : JSON.stringify({
                "username" : newUsername,
                "oldPassword" : oldPassword,
                "newPassword" : newPassword
            })
        });
        
        let oldPassError = document.querySelector(".old-password-error");
        if(response2.status === 400) {
            oldPassError.style.display = "block";
            oldPassError.innerText = "Password Incorrect";
            return;
        }
        else {
            oldPassError.style.display = "none";
        }
        if (response2.status === 200) {
            let successMsg = document.querySelector(".success-message");
            successMsg.innerText = "Profile updated successfully!";
            successMsg.style.display = "block";

            // Hide automatically after 3 seconds
            setTimeout(function() {
                successMsg.style.display = "none";
            }, 3000);

            setTimeout(function() {
                window.location.href = "index.html";
            }, 3000)
        }
    });
}

myJournals.addEventListener("click", getJournalsList);
newEntry.addEventListener("click", addNewEntry);
editProfile.addEventListener("click", editUserProfile);