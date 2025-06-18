async function sendMessage() {
    const pergunta = document.getElementById("userInput").value;
    const chatBox = document.getElementById("chatBox");
    if (pergunta.trim() === "") {
        alert("Por favor, digite uma pergunta.");
        return;
    }

    // Adiciona a pergunta do usuário
    chatBox.innerHTML += `<div class="user">${pergunta}</div><br>`;
    chatBox.innerHTML += `<div class="bot">Gemini está pensando...</div>`;

    // Scroll pro final
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

        chatBox.lastElementChild.remove(); // remove o "Gemini está pensando..."
        chatBox.innerHTML += `<div class="bot"><strong>Gemini:</strong> ${data.resposta}</div><br>`;
        chatBox.style.display = "block";
    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        chatBox.innerHTML += `<div class="bot">Erro ao processar a solicitação.</div>`;
    }

    // Limpa o input depois de enviar
    document.getElementById("userInput").value = "";
}

// Envia com Enter
document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
