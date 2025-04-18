from pydantic import BaseModel, EmailStr

# -- User Models --
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class MessageResponse(BaseModel):
    message: str

# -- Recipe Models --
class RecipeBase(BaseModel):
    name: str
    image: str
    rating: int
    bgColor: str
    category: str

class RecipeResponse(RecipeBase):
    id: str

# -- Step Validation Model --
class StepValidationResponse(BaseModel):
    success: bool
    step_index: int
