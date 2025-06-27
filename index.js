function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}


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
        // Verifica se a resposta contém blocos de código com ``` e converte para HTML
        let respostaFormatada = data.resposta
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang || ''}">${escapeHTML(code)}</code></pre>`;
            });
        respostaFormatada = respostaFormatada
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Lista com asterisco vira <ul><li>
        respostaFormatada = respostaFormatada
        .replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, '<li>$1</li>');

        // Se tiver <li>, envolve com <ul> automaticamente
        if (respostaFormatada.includes('<li>')) {
            respostaFormatada = `<ul>${respostaFormatada}</ul>`;
        }

        botMsg.innerHTML = `<strong>Gemini:</strong><br>${respostaFormatada}`;

        chatBox.appendChild(botMsg);

        hljs.highlightAll();


        /*const fala = new SpeechSynthesisUtterance(data.resposta);
        fala.lang = "pt-BR"; // Voz em português
        fala.rate = 1;       // Velocidade (1 = normal)
        fala.pitch = 1;      // Tom (1 = normal)
        fala.volume = 1;     // Volume (0 a 1)
        speechSynthesis.speak(fala);
        */

    } catch (error) {
        console.error("Erro ao enviar a mensagem:", error);
        loadingMsg.textContent = "Erro ao processar a solicitação.";
    }

    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;


}

/*function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onstart = () => {
        console.log("🎙️ Ouvindo...");
    };

    recognition.onresult = (event) => {
        const resultado = event.results[0][0].transcript;
        console.log("Você disse:", resultado);

        document.getElementById("userInput").value = resultado;
        sendMessage(); // Envia automaticamente depois de reconhecer
    };

    recognition.onerror = (event) => {
        alert("Erro ao reconhecer a fala: " + event.error);
    };
}*/


document.getElementById("userInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
