import torch
torch.cuda.empty_cache()
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info

model_id = "Qwen/Qwen2.5-VL-3B-Instruct"

print("Loading model...")
model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)

processor = AutoProcessor.from_pretrained(model_id)

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "image",
                "image": "file://C:/Repos/CookQuest/backend/app/static/images/Test.jpg",
                "resized_height": 504,
                "resized_width": 504     
            },
            {
                "type": "text",
                "text": "Describe this image.",
            },
        ],
    }
]

print("Processing image and text...")
text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)

image_inputs, video_inputs = process_vision_info(messages)

inputs = processor(
    text=[text],
    images=image_inputs,
    videos=video_inputs,
    padding=True,
    return_tensors="pt"
).to("cuda")

print("Generating response...")
generated_ids = model.generate(**inputs, max_new_tokens=128)
response = processor.batch_decode(generated_ids, skip_special_tokens=True)

print("🧠 Model Output:\n", response[0])
