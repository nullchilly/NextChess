import time
from datetime import datetime
from typing import Any

from pydantic import BaseModel
from humps import camelize, decamelize
from pydantic.v1.utils import GetterDict


class ConvertTimestamp(GetterDict):
    def get(self, key: Any, default: Any = None) -> Any:
        decamelize_key = decamelize(key)
        if isinstance(getattr(self._obj, decamelize_key), datetime):
            return time.mktime(getattr(self._obj, decamelize_key).timetuple())
        else:
            return super().get(decamelize_key, default)


class CamelBaseModel(BaseModel):
    class Config:
        alias_generator = camelize
        populate_by_name = True