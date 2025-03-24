from pydantic import BaseModel

class GenerateChatRequestDto(BaseModel):
    diary_pk: int
    content: str