"""add puzzle position limit

Revision ID: 0f369bd6c257
Revises: 92cbc2204443
Create Date: 2023-12-04 22:00:38.411071

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f369bd6c257'
down_revision = '92cbc2204443'
branch_labels = None
depends_on = None


def upgrade():
    # change type of position column from VARCHAR(255) to VARCHAR(10000)
    op.execute('ALTER TABLE `puzzle` MODIFY COLUMN `position` VARCHAR(10000) NOT NULL;')
    pass


def downgrade():
    # change type of position column from VARCHAR(10000) to VARCHAR(255)
    op.execute('ALTER TABLE `puzzle` MODIFY COLUMN `position` VARCHAR(255) NOT NULL;')
    pass
