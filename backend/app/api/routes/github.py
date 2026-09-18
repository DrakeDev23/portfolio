
import asyncio
from datetime import datetime, timedelta, timezone
from time import monotonic

import httpx
from fastapi import APIRouter, HTTPException

from app.core.config import settings


router = APIRouter()

GITHUB_USERNAME = "DrakeDev23"
CACHE_TTL_SECONDS = 60 * 60
GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

_cache: dict[str, object] = {"value": None, "expires_at": 0.0}
_cache_lock = asyncio.Lock()

CONTRIBUTIONS_QUERY = """
query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
"""


def contribution_level(count: int, maximum: int) -> int:
    if count == 0 or maximum == 0:
        return 0
    return min(4, max(1, (count * 4 + maximum - 1) // maximum))


def format_calendar(calendar: dict) -> dict:
    raw_days = [day for week in calendar["weeks"] for day in week["contributionDays"]]
    maximum = max((day["contributionCount"] for day in raw_days), default=0)

    return {
        "username": GITHUB_USERNAME,
        "total": calendar["totalContributions"],
        "weeks": [
            {
                "days": [
                    {
                        "date": day["date"],
                        "count": day["contributionCount"],
                        "level": contribution_level(day["contributionCount"], maximum),
                    }
                    for day in week["contributionDays"]
                ]
            }
            for week in calendar["weeks"]
        ],
    }


@router.get("/contributions")
async def get_contributions():
    if _cache["value"] is not None and monotonic() < _cache["expires_at"]:
        return _cache["value"]

    if not settings.GITHUB_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="GitHub activity is not configured on the server.",
        )

    async with _cache_lock:
        if _cache["value"] is not None and monotonic() < _cache["expires_at"]:
            return _cache["value"]

        now = datetime.now(timezone.utc)
        variables = {
            "login": GITHUB_USERNAME,
            "from": (now - timedelta(days=364)).isoformat(),
            "to": now.isoformat(),
        }
        headers = {
            "Authorization": f"Bearer {settings.GITHUB_TOKEN}",
            "Content-Type": "application/json",
            "User-Agent": "drakedev-portfolio",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    GITHUB_GRAPHQL_URL,
                    headers=headers,
                    json={"query": CONTRIBUTIONS_QUERY, "variables": variables},
                )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=503,
                detail="GitHub activity is temporarily unavailable.",
            ) from exc

        if response.status_code in (401, 403, 429):
            raise HTTPException(
                status_code=429,
                detail="GitHub activity is temporarily rate limited.",
            )
        if response.status_code >= 500:
            raise HTTPException(
                status_code=503,
                detail="GitHub activity is temporarily unavailable.",
            )
        if response.status_code >= 400:
            raise HTTPException(status_code=502, detail="GitHub activity could not be retrieved.")

        try:
            payload = response.json()
        except ValueError as exc:
            raise HTTPException(
                status_code=502,
                detail="GitHub activity could not be retrieved.",
            ) from exc
        errors = payload.get("errors", [])
        if errors:
            message = " ".join(error.get("message", "") for error in errors).lower()
            if "could not resolve to a user" in message or "not found" in message:
                raise HTTPException(status_code=404, detail="GitHub username was not found.")
            if "rate limit" in message:
                raise HTTPException(status_code=429, detail="GitHub activity is temporarily rate limited.")
            raise HTTPException(status_code=502, detail="GitHub activity could not be retrieved.")

        user = payload.get("data", {}).get("user")
        if not user:
            raise HTTPException(status_code=404, detail="GitHub username was not found.")

        result = format_calendar(user["contributionsCollection"]["contributionCalendar"])
        _cache["value"] = result
        _cache["expires_at"] = monotonic() + CACHE_TTL_SECONDS
        return result
