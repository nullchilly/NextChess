from sqlalchemy.orm import Session

from api.app.model.user import User


class UserProvider:
    @classmethod
    def create_user(cls, db: Session, commit: bool=False, **data) -> User:
        new_user_data = {
            "id": data.get('id', None),
            'is_admin': data.get('is_admin', False),
            "user_name": data.get('user_name', "test_user_name"),
            "name": data.get('name', "name_test"),
            "password": data.get('password', "test_user_password"),
            "email": data.get('email', "test_user_email"),
            "gender": data.get('gender', "male"),
            "date_of_birth": data.get('date_of_birth', "2003-01-01"),
            "access_token": data.get('access_token', None)
        }
        new_user: User = User.create(db, new_user_data, commit=commit)
        return new_user
