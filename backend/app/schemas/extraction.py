from pydantic import BaseModel, Field
from typing import List, Optional

class Stakeholder(BaseModel):
    name: str = Field(..., description="The name of the buyer stakeholder")
    role: Optional[str] = Field(None, description="The role or title of the stakeholder")
    sentiment: Optional[str] = Field(None, description="Sentiment towards the deal: positive, neutral, or negative")

class Objection(BaseModel):
    summary: str = Field(..., description="Brief summary of the customer objection")
    severity: str = Field(..., description="Severity: low, medium, or high")
    resolved: bool = Field(False, description="Whether the objection has been resolved")

class Promise(BaseModel):
    description: str = Field(..., description="The specific promise made by the salesperson")
    due_date: Optional[str] = Field(None, description="The date by which the promise must be fulfilled")
    completed: bool = Field(False, description="Whether the promise has been fulfilled")

class CompetitorSignal(BaseModel):
    competitor_name: str = Field(..., description="The name of the competitor mentioned")
    signal: str = Field(..., description="What was mentioned about the competitor")

class ExtractionResult(BaseModel):
    stakeholders: List[Stakeholder] = Field(default_factory=list)
    objections: List[Objection] = Field(default_factory=list)
    promises: List[Promise] = Field(default_factory=list)
    competitor_signals: List[CompetitorSignal] = Field(default_factory=list)
