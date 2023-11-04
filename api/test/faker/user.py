from sqlalchemy.orm import Session

from api.app.model.user import User


class UserProvider:
    @classmethod
    def create_user(cls, db: Session, commit: bool=False, **data) -> User:
        new_user_data = {
            "id": data.get('id', None),
            "name": data.get('name', "test_user_name"),
            "password": data.get('password', "test_user_password"),
            "email": data.get('email', "test_user_email")
        }
        new_user: User = User.create(db, new_user_data, commit=commit)
        return new_user
