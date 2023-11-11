from typing import TypeVar, Optional, Generic

from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

class ResponseSchemaBase(BaseModel):
    __abstract__ = True

    code: int = ""
    message: str = ""

    def custom_response(self, code: int, message: str):
        self.code = code
        self.message = message
        return self

    def success_response(self):
        self.code = 200
        self.message = 'Success'
        return self

    def fail_response(self, code: int, message: str):
        self.code = code
        self.message = message
        return self


class DataResponse(ResponseSchemaBase, GenericModel, Generic[T]):
    data: Optional[T] = None

    class Config:
        arbitrary_types_allowed = True

    def custom_response(self, code: int, message: str, data: T):
        self.code = code
        self.message = message
        self.data = data
        return self

    def success_response(self, data: Optional[T]):
        self.code = 200
        self.message = 'Success'
        self.data = data
        return self

    def fail_response(self, code: int, message: str, data: T = None):
        self.code = code
        self.message = message
        self.data = data
        return self
