from datasets import Dataset
import json

with open("math_data.json", "r", encoding="utf-8") as f:
    raw_data = json.load(f)

# 將 messages 轉成 prompt-response 格式
formatted_data = []
for sample in raw_data:
    messages = sample["messages"]
    prompt = ""
    for m in messages:
        if m["role"] == "user":
            prompt += f"User: {m['content']}\n"
        elif m["role"] == "assistant":
            prompt += f"Assistant: {m['content']}\n"
    formatted_data.append({"text": prompt.strip()})

dataset = Dataset.from_list(formatted_data)
