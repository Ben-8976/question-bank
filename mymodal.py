from transformers import pipeline, AutoTokenizer
import gradio as gr

# 載入模型與 tokenizer
tokenizer = AutoTokenizer.from_pretrained("gpt2")
pipe = pipeline("text-generation", model="QINchampion/output", tokenizer=tokenizer)

# 聊天函式需要接收兩個參數：message 和 history
def chatbot(message, history):
    # 將歷史對話整理成提示詞
    prompt = ""
    for user, bot in history:
        prompt += f"問：{user}\n答：{bot}\n"
    prompt += f"問：{message}\n答："

    output = pipe(prompt, max_new_tokens=100, temperature=0.7)[0]["generated_text"]

    # 提取 AI 回答內容（只取最後一個「答：」後面的內容）
    answer = output.split("答：")[-1].strip()
    return answer

# 用 Gradio 建立聊天室介面
iface = gr.ChatInterface(chatbot, title="數學 AI 聊天機器人")
iface.launch()
