from typing import Annotated, Literal, Optional
from pydantic import BaseModel, Field


class EventSchema(BaseModel):
    id: str
    name: str
    location: str
    date: str
    role: str
    achievement: Optional[str] = None
    desc: str

    class Config:
        from_attributes = True


class ProjectSchema(BaseModel):
    id: str
    title: str
    subtitle: str
    desc: str
    tags: list[str]
    color: str
    image: str
    likes: int

    class Config:
        from_attributes = True


HexColor = Annotated[str, Field(pattern=r"^#[0-9A-Fa-f]{6}$")]


class SkillItemSchema(BaseModel):
    name: str
    label: Optional[str] = None
    color: Optional[HexColor] = None
    text_color: Optional[HexColor] = None


class SkillCategorySchema(BaseModel):
    title: str
    type: Literal["icons", "badges"]
    items: list[SkillItemSchema]


class SecurityToolSchema(BaseModel):
    name: str
    color: HexColor


class SkillsResponse(BaseModel):
    categories: list[SkillCategorySchema]
    security_tools: list[SecurityToolSchema]
