from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.db.database import get_db
from app.db import crud
from app.api.routes.profile import PROFILE
from app.api.routes.experience import EXPERIENCE
from app.api.routes.certifications import CERTIFICATIONS
from app.data.skills import SECURITY_TOOLS, SKILL_CATEGORIES
from app.data.projects import PROJECTS as DEFAULT_PROJECTS
from app.data.events import EVENTS as DEFAULT_EVENTS
from app.db.schemas import BootstrapResponse, SkillsResponse

router = APIRouter()


@router.get("", response_model=BootstrapResponse)
async def get_bootstrap(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    projects = []
    events = []
    if db_status == "connected":
        try:
            projects = await crud.get_projects(db)
            events = await crud.get_events(db)
        except Exception:
            pass

    if not projects:
        projects = [
            {**p, "likes": p.get("likes", 0)} for p in DEFAULT_PROJECTS
        ]

    if not events:
        events = DEFAULT_EVENTS

    skills = SkillsResponse(categories=SKILL_CATEGORIES, security_tools=SECURITY_TOOLS)

    return BootstrapResponse(
        status="online" if db_status == "connected" else "degraded",
        database=db_status,
        profile=PROFILE,
        projects=projects,
        skills=skills,
        events=events,
        experience=EXPERIENCE,
        certifications=CERTIFICATIONS,
    )
