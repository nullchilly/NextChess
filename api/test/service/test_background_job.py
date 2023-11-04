from api.app.model import User
from api.test.faker import UserProvider

def test_connect_db(session):
    new_user = UserProvider.create_user(session)
    users = session.query(User).all()
    assert len(users) == 1
    assert users[0].name == new_user.name
    assert users[0].password == new_user.password
    assert users[0].email == new_user.email
    assert users[0].is_admin == new_user.is_admin
