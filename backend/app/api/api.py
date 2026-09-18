from fastapi import APIRouter
from app.api.routes.projects import router as projects_router
from app.api.routes.events   import router as events_router
from app.api.routes.skills   import router as skills_router
from app.api.routes.contact  import router as contact_router
from app.api.routes.chat import router as chat_router
from app.api.routes.health import router as health_router
from app.api.routes.profile import router as profile_router
from app.api.routes.experience import router as experience_router
from app.api.routes.certifications import router as certifications_router
from app.api.routes.github import router as github_router


api_router = APIRouter()
api_router.include_router(health_router, prefix="/health")
api_router.include_router(profile_router, prefix="/profile")
api_router.include_router(projects_router, prefix="/projects")
api_router.include_router(events_router,   prefix="/events")
api_router.include_router(skills_router,   prefix="/skills")
api_router.include_router(experience_router, prefix="/experience")
api_router.include_router(certifications_router, prefix="/certifications")
api_router.include_router(contact_router,  prefix="/contact")
api_router.include_router(chat_router, prefix="/chat", tags=["chat"])
api_router.include_router(github_router, prefix="/github", tags=["github"])
