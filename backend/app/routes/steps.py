from fastapi import APIRouter, UploadFile, File, Form, Depends
from app.dependencies import get_current_user
from app.models import StepValidationResponse

router = APIRouter()

@router.post("/validate-step/", response_model=StepValidationResponse)
async def validate_step(
    step_index: int = Form(...),
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    contents = await file.read()
    print(f"User: {user['email']} | Step: {step_index} | Size: {len(contents)} bytes")

    return {"success": True, "step_index": step_index}
