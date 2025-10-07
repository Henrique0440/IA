document.addEventListener("DOMContentLoaded", () => {
    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');
    }

    if (localStorage.getItem("logado") !== "sim") {
        window.location.href = "login.html";
    }

    const input = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const enviarBtn = document.getElementById("enviarBtn");

    let historicoMensagens = [];

    async function sendMessage() {
        const pergunta = input.value.trim();
        if (!pergunta) {
            alert("Por favor, digite uma pergunta.");
            return;
        }

        // Mensagem do usuário
        const userMsg = document.createElement("div");
        userMsg.className = "user";
        userMsg.textContent = pergunta;
        chatBox.appendChild(userMsg);

        // Mensagem de carregando
        const loadingMsg = document.createElement("div");
        loadingMsg.className = "bot";
        loadingMsg.textContent = "Gemini está pensando...";
        chatBox.appendChild(loadingMsg);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            const contexto = historicoMensagens.map(msg => msg.content).join('\n');
            const perguntaComContexto = `${contexto}\n${pergunta}`;

            const resposta = await fetch('https://api-gemini-henrique0440s-projects.vercel.app/api/gemini', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pergunta: perguntaComContexto })
            });

            const data = await resposta.json();
            const respostaTexto = data.resposta || 'Sem resposta';
            loadingMsg.remove();

            // Formata a resposta
            let respostaFormatada = respostaTexto;
            const codeBlocks = [];

            // Extrai blocos de código
            respostaFormatada = respostaFormatada.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
                codeBlocks.push(`<pre><code class="language-${lang || ''}">${escapeHTML(code)}</code></pre>`);
                return `{{CODEBLOCK-${codeBlocks.length - 1}}}`;
            });

            // Formata negrito, links, listas e inline code
            respostaFormatada = respostaFormatada
                .replace(/`([^`\n]+)`/g, '<code>$1</code>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
                .replace(/(?:^|\n)\* (.*?)(?=\n|$)/g, '<li>$1</li>')
                .replace(/\n/g, '<br>');

            if (respostaFormatada.includes('<li>')) {
                respostaFormatada = `<ul>${respostaFormatada}</ul>`;
            }

            // Substitui os blocos de código
            respostaFormatada = respostaFormatada.replace(/\{\{CODEBLOCK-(\d+)\}\}/g, (_, index) => codeBlocks[index]);

            const botMsg = document.createElement("div");
            botMsg.className = "bot";
            botMsg.innerHTML = `<strong>Gemini:</strong><br>${respostaFormatada}`;
            chatBox.appendChild(botMsg);

            // Highlight (se estiver usando highlight.js)
            if (window.hljs) hljs.highlightAll();

            // Atualiza histórico
            historicoMensagens.push({ role: "user", content: pergunta });
            historicoMensagens.push({ role: "bot", content: data.resposta });

            while (historicoMensagens.length > 20) historicoMensagens.shift();

        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
            loadingMsg.textContent = "Erro ao processar a solicitação.";
        }

        input.value = "";
        input.focus();
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    enviarBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});
