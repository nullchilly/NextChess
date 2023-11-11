from api.app.model import User
from api.test.faker import UserProvider

def test_connect_db(session):
    new_user = UserProvider.create_user(session)
    users = session.query(User).all()
    assert len(users) == 1
    assert users[0].user_name == new_user.user_name
    assert users[0].password == new_user.password
    assert users[0].email == new_user.email
    assert users[0].is_admin == new_user.is_admin

def test_get_token(client):
    request = {
        'userName': 'user_name_test',
        'name': 'name_test',
        'dateOfBirth': 1234,
        'gender': 'man',
        'email': 'test@gmail.com',
        'password': '23',
    }
    resp = client.post("/auth/signup/", json=request)
    print(resp.json().get('accessToken'))
    assert resp.json().get('accessToken') == ""
