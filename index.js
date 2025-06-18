async function sendMessage() {
    const input = document.getElementById("userInput");
    const pergunta = input.value.trim();
    const chatBox = document.getElementById("chatBox");

    if (pergunta === "") {
        alert("Por favor, digite uma pergunta.");
        return;
    }

    const userMsg = document.createElement("div");
    userMsg.className = "user";
    userMsg.textContent = pergunta;
    chatBox.appendChild(userMsg);

    const loadingMsg = document.createElement("div");
    loadingMsg.className = "bot";
    loadingMsg.textContent = "Gemini está pensando...";
    chatBox.appendChild(loadingMsg);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const resposta = await fetch('https://api-gemini-henrique0440s-projects.vercel.app/api/gemini', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pergunta })
        });

        const data = await resposta.json();

        loadingMsg.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "bot";
        botMsg.innerHTML = `<strong>Gemini:</strong> ${data.resposta}`;
        chatBox.appendChild(botMsg);

    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        loadingMsg.textContent = "Erro ao processar a solicitação.";
    }

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;
}


document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
