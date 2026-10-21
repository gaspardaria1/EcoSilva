# app/db/models.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
import uuid


class Zone(BaseModel):
    id: uuid.UUID
    name: str
    code: str
    created_at: datetime


class Tree(BaseModel):
    id: uuid.UUID
    chip_id: str
    zone_id: Optional[uuid.UUID]
    species: Optional[str]
    planting_date: date
    cut_date: Optional[date]
    status: str  # active, cut, missing, anomaly
    last_signal_at: Optional[datetime]
    created_at: datetime


class Anomaly(BaseModel):
    id: uuid.UUID
    tree_id: Optional[uuid.UUID]
    zone_id: Optional[uuid.UUID]
    anomaly_type: str
    severity: str
    detected_at: datetime
    description: Optional[str]
    resolved: bool


class UserProfile(BaseModel):
    id: uuid.UUID
    full_name: Optional[str]
    role: str
    skill_level: str  # L0, L1
    prompt_score_avg: float
