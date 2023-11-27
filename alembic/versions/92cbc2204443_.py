"""empty message

Revision ID: 92cbc2204443
Revises: 281359f35c76
Create Date: 2023-11-29 16:10:36.143423

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '92cbc2204443'
down_revision = '281359f35c76'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('puzzle', sa.Column('moves', sa.String(length=255), nullable=True))
    op.add_column('puzzle', sa.Column('fen', sa.String(length=50), nullable=True))
    pass


def downgrade():
    op.drop_column('puzzle', 'moves')
    op.drop_column('puzzle', 'fen')
    pass
