from sqlmodel import Session
from .models import Post, engine

def get_all_post():
    session = Session(engine)
    posts = session.query(Post).all()
    return posts

def get_post(post_id: int):
    session = Session(engine)
    post = session.get(Post, post_id)
    return post

def remove_post(post_id: int):
    session = Session(engine)
    post = session.get(Post, post_id)
    session.delete(post)
    session.commit()
    return post

def add_post(
    title: str,
    search_query: dict,
    search_result: dict,
    ):
    session = Session(engine)

    post = Post(
        title = title,
        search_query = search_query,
        search_result = search_result,
    )
    
    session.add(post)
    session.commit()
    session.refresh(post)
    return post

def save_links(
        post_id: int,
        choosen_links: dict,
):
    session = Session(engine)
    
    post = session.get(Post, post_id)
    post.choosen_links = choosen_links
    
    session.add(post)
    session.commit()
    session.refresh(post)
    
    return post

