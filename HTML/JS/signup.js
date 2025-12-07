let submitForm = document.querySelector("form");
let usernameInput = document.querySelector(".form-group .username");
let passwordInput = document.querySelector(".form-group .password");
let usernameError = document.querySelector(".form-group .user");
let passwordError = document.querySelector(".form-group .pass");
const URL = "http://localhost:8080/public/signup";

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
        passwordError.textContent = "Password cannot be empty!";
        usernameError.style.display = "block";
        passwordError.style.display = "block";
        return;
    }
    if(username === "" || username === null) {
        usernameError.textContent = "Username cannot be empty!";
        usernameError.style.display = "block";
        return;
    }
    if(password === "" || password === null) {
        passwordError.textContent = "Username cannot be empty!";
        passwordError.style.display = "block";
        return;
    }

    /*
    When your JS calls:
        fetch("http://localhost:8080/public/signup")
        The browser says:
            “NOPE! The origin (5050) is trying to talk to a different origin (8080).
            I won’t allow this unless the backend explicitly says it’s OK.”
        This browser protection is called CORS
        (Cross-Origin Resource Sharing).
        Therefore, we add CORS configuration in our backend's security config file.
    */
    try {
        const response = await fetch(URL, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                "username" : username,
                "password" : password
            })
        });
        // const data = await response.json(); // Since right now, our backend isn't returning any json, so parsing it will throw error.
        if(response.status === 409) {
            const userError = document.querySelector(".username-error");
            userError.style.display = "block";
            userError.innerText = "Username already exists!";
            return;
        }
        if(response.ok) {
            /*
            Think of the browser as an object called window. Inside it, there is a small helper object called location. 
            location represents the URL bar in your browser. And .href is the actual URL currently shown.
            */
            window.location.href = "index.html";
        }
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