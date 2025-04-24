import torch
import re
from transformers import Qwen2_5_VLForConditionalGeneration, AutoProcessor
from qwen_vl_utils import process_vision_info

# Load model & processor
model_id = "Qwen/Qwen2.5-VL-3B-Instruct"
print("🔁 Loading Qwen2.5-VL model...")
model = Qwen2_5_VLForConditionalGeneration.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    device_map="auto"
)
processor = AutoProcessor.from_pretrained(model_id)

def evaluate_step_with_llm(image_url: str, step_description: str) -> tuple[str, int]:
    """
    Evaluates a cooking step photo using Qwen2.5-VL.
    If step is perfect, gives 5/5 score.
    If not, LLM must explain the reason for the reduction.
    """
    try:
        # Define prompt
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
                            f"You are an expert cooking evaluator.\n"
                            f"The user has taken a picture while cooking the step:\n\n"
                            f"'{step_description}'\n\n"
                            f"Evaluate this image.\n"
                            f"- If the step is perfectly followed, say: 'Perfect! Score: 10'\n"
                            f"- If not, explain briefly (in 1-2 lines) what went wrong and give a score from 0 to 9.\n"
                            f"End with 'Score: X' where X is the number."
                        )
                    },
                ],
            }
        ]

        # Prepare inputs
        text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)

        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt"
        ).to("cuda")

        # Run inference
        generated_ids = model.generate(**inputs, max_new_tokens=128)
        output = processor.batch_decode(generated_ids, skip_special_tokens=True)[0].strip()

        # Extract score
        score_match = re.search(r"\b(10|[0-9])\b", output)
        raw_score = int(score_match.group(1)) if score_match else 10
        normalized_score = 5 if raw_score >= 10 else round((raw_score / 10) * 5)

        # Enforce short explanation if score < 10
        if raw_score < 10 and "because" not in output.lower() and len(output.split()) < 5:
            output = f"The step was not followed properly. Score: {raw_score}"

        return output, normalized_score

    except Exception as e:
        print("❌ LLM evaluation failed:", e)
        return "Evaluation failed. Please try again later.", 3
