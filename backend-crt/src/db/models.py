from typing import Optional
from sqlmodel import Field, SQLModel, create_engine, JSON, Column

from datetime import datetime

class Post(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    content: str = None
    raw_notes: str = None
    search_query: dict = Field(sa_column=Column(JSON))
    search_result: dict = Field(sa_column=Column(JSON))
    choosen_links: dict = Field(sa_column=Column(JSON))
    links_scrape_result: dict = Field(sa_column=Column(JSON))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# echo is for debugging
engine = create_engine("postgresql://postgres:password@db/crtool", echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == "__main__":
    # when running from env file, must use `localhost` instead of `dockername=db`
    engine = create_engine("postgresql://postgres:password@localhost/crtool", echo=True)
    create_db_and_tables()