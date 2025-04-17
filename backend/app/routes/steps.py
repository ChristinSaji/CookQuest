from fastapi import APIRouter, UploadFile, File, Form

router = APIRouter()

@router.post("/validate-step/")
async def validate_step(step_index: int = Form(...), file: UploadFile = File(...)):
    contents = await file.read()
    print(f"Received file for step {step_index}, size: {len(contents)} bytes")
    
    return {"success": True, "step_index": step_index}