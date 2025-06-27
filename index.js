function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

let historicoMensagens = [];
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
        let contexto = historicoMensagens.map(msg => {
            return msg.content;
        }).join('\n');

        const perguntaComContexto = `${contexto}\n${pergunta}`;
        console.log("Pergunta com contexto:", perguntaComContexto);

        const resposta = await fetch('https://api-gemini-henrique0440s-projects.vercel.app/api/gemini', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ pergunta: perguntaComContexto })
        });


        const data = await resposta.json();

        loadingMsg.remove();

        const botMsg = document.createElement("div");
        botMsg.className = "bot";
        // Verifica se a resposta contém blocos de código com ``` e converte para HTML
        let respostaFormatada = data.resposta
            // Blocos de código
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                return `<pre><code class="language-${lang || ''}">${escapeHTML(code)}</code></pre>`;
            })

            // Negrito em Markdown
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')

            // Markdown: [texto](link)
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

            // Links diretos (https://...)
            .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')

            // Listas com *
            .replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, '<li>$1</li>')

            // Quebras de linha
            .replace(/\n/g, '<br>');

        // Envolve listas com <ul> se tiver <li>
        if (respostaFormatada.includes('<li>')) {
            respostaFormatada = `<ul>${respostaFormatada}</ul>`;
        }


        botMsg.innerHTML = `<strong>Gemini:</strong><br>${respostaFormatada}`;

        chatBox.appendChild(botMsg);

        hljs.highlightAll();

        historicoMensagens.push({ role: "user", content: pergunta });
        historicoMensagens.push({ role: "bot", content: data.resposta });

        while (historicoMensagens.length > 10 * 2) {
            historicoMensagens.shift();
        }



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
