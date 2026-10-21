from typing import List, Union
import json
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_publishable_key: str = ""
    database_url: str = ""

    # Gemini
    gemini_api_key: str = ""

    # App
    secret_key: str = "dev-secret-key-change-this"
    environment: str = "development"
    cors_origins: List[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Union[str, List[str]]):
        if isinstance(value, str):
            # Dacă vine sub formă de listă JSON din .env: ["a", "b"]
            if value.startswith("[") and value.endswith("]"):
                try:
                    return json.loads(value)
                except Exception:
                    # Fallback dacă JSON fail-uiește, curățăm manual parantezele
                    value = value.strip("[]")

            # Split normal pentru formatul: url1, url2
            return [origin.strip().strip('"').strip("'") for origin in value.split(",") if origin.strip()]
        return value

    @property
    def supabase_key(self) -> str:
        return self.supabase_publishable_key or self.supabase_anon_key


settings = Settings()