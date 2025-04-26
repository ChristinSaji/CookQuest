import torch
import re
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info

model_id = "Qwen/Qwen2.5-VL-3B-Instruct"
print("🔁 Loading Qwen2.5-VL model...")
model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)
processor = AutoProcessor.from_pretrained(model_id)

def evaluate_step_with_llm(
    image_url: str,
    meal_name: str,
    ingredients_list: list,
    all_steps: list,
    current_step_index: int
) -> tuple[str, int]:
    try:
        current_step = all_steps[current_step_index]

        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "image": image_url,
                        "resized_height": 504,
                        "resized_width": 504
                    },
                    {
                        "type": "text",
                        "text": (
                            f"You are an expert health-focused cooking evaluator for a gamified food app.\n\n"
                            f"The user is preparing the meal: '{meal_name}'.\n"
                            f"Ingredients include: {', '.join(ingredients_list)}.\n\n"
                            f"The user is currently working on the step:\n"
                            f"\"{current_step}\"\n\n"
                            "**Important Instructions:**\n"
                            "1. First, verify if the uploaded image relates to the current step. If it clearly shows unrelated items "
                            "(such as a laptop, keyboard, wall, etc.), assign Score: 0 and Feedback: 'The submitted image is unrelated to the expected cooking step.'\n\n"
                            "2. If the image is related, evaluate ONLY how accurately the user has completed THIS current step "
                            "based on healthiness, correctness, and completeness. Ignore minor visual flaws or overall meal completion.\n\n"
                            "**Scoring Rules:**\n"
                            "- Award a full 10/10 if the step is correctly completed.\n"
                            "- Deduct points only for clear mistakes in the current step (e.g., missing key actions or unhealthy errors).\n\n"
                            "**Strict Output Format:**\n"
                            "Feedback: <short feedback>\n"
                            "Score: <integer between 0 and 10>\n\n"
                            "Do not comment on other steps. Evaluate only the CURRENT step. Do not repeat these instructions."
                        )
                    }
                ]
            }
        ]

        text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)

        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt"
        ).to("cuda")

        generated_ids = model.generate(**inputs, max_new_tokens=128)
        output = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()
        print("🔎 LLM Output:\n", output)

        assistant_section = re.split(r"assistant", output, flags=re.IGNORECASE)
        if len(assistant_section) < 2:
            raise ValueError("Assistant response not found.")
        assistant_response = assistant_section[-1]

        feedback_match = re.search(r"Feedback:\s*(.+?)\s*Score:", assistant_response, re.IGNORECASE | re.DOTALL)
        feedback = feedback_match.group(1).strip() if feedback_match else "Step completed."

        score_match = re.search(r"Score[:\s]+(\d+)", assistant_response, re.IGNORECASE)
        raw_score = int(score_match.group(1)) if score_match else 10

        return feedback, raw_score

    except Exception as e:
        print("❌ LLM evaluation failed:", e)
        return "Evaluation failed. Please try again later.", 3
