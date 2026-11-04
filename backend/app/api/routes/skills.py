from fastapi import APIRouter

from app.data.skills import SECURITY_TOOLS, SKILL_CATEGORIES
from app.db.schemas import SkillsResponse

router = APIRouter()


@router.get("", response_model=SkillsResponse)
async def get_skills() -> SkillsResponse:
    return SkillsResponse(categories=SKILL_CATEGORIES, security_tools=SECURITY_TOOLS)
