const GEMINI_API_KEY = "AIzaSyDMgyznDhS8RlfR9_vXlCz_ENot6cqU4Vc";

async function sendMessage() {
    var pergunta = document.getElementById("userInput").value;
    var chatBox = document.getElementById("chatBox");
    chatBox.innerHTML += `<div class="user">${pergunta}</div><br>`;
    chatBox.innerHTML += `<div class="bot">Gemini está pensando...</div>`;


    // Scroll pro final
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        var resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: pergunta }] }]
            })
        });

        const data = await resposta.json();
        const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
        chatBox.lastElementChild.remove();
        chatBox.innerHTML += `<div class="bot"><strong>Gemini:</strong> ${texto}</div><br>`;
        chatBox.style.display = "block";
    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        chatBox.innerHTML = "Ocorreu um erro ao processar sua solicitação.";
    }
}

document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // impede quebra de linha se for um textarea
        sendMessage();
        document.getElementById("userInput").value = "";
    }
});
