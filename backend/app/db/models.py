from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Deal(Base):
    __tablename__ = "deals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    status = Column(String, default="Open")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    interactions = relationship("Interaction", back_populates="deal")
    # Removed the problematic 'interaction_extractions' relationship.
    # Extractions are already linked to Deals via a ForeignKey in the Extraction model.
    # We can access them via a relationship to the Extraction class directly.
    extractions = relationship("Extraction", back_populates="deal")

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=False)
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    interaction_type = Column(String, default="Note") # e.g., Call, Email, Note

    deal = relationship("Deal", back_populates="interactions")
    extractions = relationship("Extraction", back_populates="interaction")

class Extraction(Base):
    __tablename__ = "extractions"

    id = Column(Integer, primary_key=True, index=True)
    interaction_id = Column(Integer, ForeignKey("interactions.id"), nullable=False)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=False)
    data = Column(JSON, nullable=False) # Structured extracted facts
    created_at = Column(DateTime, default=datetime.utcnow)

    interaction = relationship("Interaction", back_populates="extractions")
    deal = relationship("Deal", back_populates="extractions")
