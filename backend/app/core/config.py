from pydantic import field_validator
from pydantic_settings import BaseSettings

_DECOMMISSIONED_GROQ_MODELS = {
    "llama-3.3-70b-versatile": "openai/gpt-oss-20b",
    "llama-3.1-8b-instant": "openai/gpt-oss-20b",
}


class Settings(BaseSettings):
    EMAILJS_SERVICE_ID:  str
    EMAILJS_TEMPLATE_ID: str
    EMAILJS_PUBLIC_KEY:  str
    EMAILJS_PRIVATE_KEY: str
    GROQ_API_KEY: str
    GROQ_MODEL: str = "openai/gpt-oss-20b"
    DATABASE_URL: str
    GITHUB_TOKEN: str | None = None

    @field_validator("GROQ_MODEL")
    @classmethod
    def migrate_decommissioned_groq_model(cls, value: str) -> str:
        replacement = _DECOMMISSIONED_GROQ_MODELS.get(value, value)
        if replacement != value:
            print(
                f"GROQ_MODEL {value!r} was decommissioned; using {replacement!r} instead",
                flush=True,
            )
        return replacement

    class Config:
        env_file = ".env"


settings = Settings()
