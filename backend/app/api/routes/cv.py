from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()

CV_PATH = Path(__file__).resolve().parents[3] / "files" / "Drake_CV.pdf"


@router.get("")
async def download_cv() -> FileResponse:
    if not CV_PATH.is_file():
        raise HTTPException(status_code=404, detail="CV not found.")
    return FileResponse(CV_PATH, media_type="application/pdf", filename="Drake_CV.pdf")
