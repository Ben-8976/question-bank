const form = document.getElementById('ask-form');
const textarea = document.getElementById('ask-content');
const dialogueArea = document.querySelector('#dialogue-area');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userInput = textarea.value.trim();
  if (!userInput) return;

  addMessage("👦 " + userInput, 'user-msg');

  textarea.value = '';
  textarea.disabled = true;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
        "HTTP-Referer": "https://mychatapp.com",
        "X-Title": "My Chat App"
      },
      body: JSON.stringify({
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          { role: "system", content: "你是一個親切又懂程式的 AI 小助手，正在幫助國中生。" },
          { role: "user", content: userInput }
        ]
      })
    });

    if (!response.ok) throw new Error(`HTTP 錯誤 ${response.status}`);

    const result = await response.json();
    const aiReply = result.choices?.[0]?.message?.content || '⚠️ AI 沒有回應內容';
    addMessage("🤖 " + aiReply, 'ai-msg');
  } catch (error) {
    addMessage(`❌ 發生錯誤：${error.message}`, 'ai-msg');
  } finally {
    textarea.disabled = false;
    textarea.focus();
  }
});

// 自動加入訊息與捲動
function addMessage(text, className) {
  const div = document.createElement('div');
  div.className = `message ${className}`;
  div.textContent = text;
  dialogueArea.appendChild(div);
  dialogueArea.scrollTop = dialogueArea.scrollHeight;
}

// Enter送出，Shift+Enter換行
textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
