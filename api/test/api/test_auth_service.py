import pytest

from api.app.model import User
from api.test.faker import UserProvider


@pytest.mark.parametrize('req',
                         [
                             ({
                                 "userName": "test_user",
                                 "name": "tu.na",
                                 "dateOfBirth": "2003-12-12",
                                 "gender": "male",
                                 "email": "test@gmail.com",
                                 "password": "secret"
                             })
                         ])
def test_register(session, client, req):
    resp = client.post('/api/register', json=req)
    assert resp.json().get('code') == 200
    assert resp.json().get('data').get('role') == "user"
    user = session.query(User).filter(User.user_name == req.get('userName')).first()
    assert user is not None
    assert user.password == req.get('password')

@pytest.mark.parametrize('req, expected_resp',
                         [
                             (
                                 {
                                    "userName": "user_name_test",
                                    "password": "secret",
                                 },
                                {
                                    "code": 200,
                                    "message": "Success",
                                    "data": {
                                        "accessToken": "secret",
                                    }
                                },
                             ),
                             (
                                 {
                                    "userName": "test_user_name",
                                    "password": "secret",
                                 },
                                {
                                    "detail": "Username or password is incorrect",
                                },
                             )
                         ])
def test_login(session, client, req, expected_resp):
    UserProvider().create_user(db=session, commit=True, user_name="user_name_test", password="secret", access_token="secret")
    resp = client.post('/api/login', json=req)
    assert resp.json() == expected_resp

def test_get_profile_by_id(session, client):
    UserProvider.create_user(session, id=1)
    resp = client.get('/api/profile/1')
    expected_resp = {
        "code": 200,
        "message": "Success",
        "data": {
            "userId": 1,
            "userName": "test_user_name",
            "name": "name_test",
            "dateOfBirth": "2003-01-01",
            "gender": "male",
            "email": "test_user_email"
        }
    }
    assert resp.json() == expected_resp


@pytest.mark.parametrize('req, headers, expected_http_code, expected_resp',
                         [
                             (
                                 {
                                    "name": "test",
                                    "dateOfBirth": "2003-01-01",
                                    "gender": "male",
                                    "email": "test@gmail.com"
                                 },
                                 {
                                     "accessToken": "secret"
                                 }, 200,
                                 {
                                    "code": 200,
                                     "message": "Success"
                                 }
                             ),
                             (
                                 {
                                    "name": "test",
                                    "dateOfBirth": "2003-01-01",
                                    "gender": "male",
                                    "email": "test@gmail.com"
                                 },
                                 {
                                     "accessToken": "test"
                                 }, 404,
                                 {
                                     "detail": "User not found"
                                 }
                             ),
                             (
                                 {
                                    "name": "test",
                                    "dateOfBirth": "2003-01-01",
                                    "gender": "male",
                                    "email": "test@gmail.com"
                                 }, None, 403,
                                 {
                                     "detail": "Forbidden"
                                 }
                             )
                         ])
def test_update_profile(session, client, req, headers, expected_resp, expected_http_code):
    UserProvider().create_user(session)
    resp = client.post("/api/profile", headers=headers, json=req)
    assert resp.status_code == expected_http_code
    assert resp.json() == expected_resp