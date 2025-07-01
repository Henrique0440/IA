const loginButton = document.getElementById("entrar");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usuarios = {
    admin: "1234",
    henrique0440: "HENRIQUE0440",
    outroUsuario: "senha123"
};

loginButton.addEventListener("click", () => {
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (usuarios[username] && usuarios[username] === password) {
        localStorage.setItem("logado", "sim");
        localStorage.setItem("usuario", username);

        window.location.href = "index.html";
    } else {
        alert("Usuário ou senha inválidos!");
    }
});

document.getElementById("userInput").addEventListener("keydown", function (event) {
    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    if (event.key === "Enter") {

        if (usuarios[username] && usuarios[username] === password) {
            localStorage.setItem("logado", "sim");
            localStorage.setItem("usuario", username);

            window.location.href = "index.html";
        } else {
            alert("Usuário ou senha inválidos!");
        }
    }
});
