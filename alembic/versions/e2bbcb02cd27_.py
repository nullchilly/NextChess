"""empty message

Revision ID: e2bbcb02cd27
Revises: 7ce64b27e610
Create Date: 2023-11-11 11:27:12.869097

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2bbcb02cd27'
down_revision = '7ce64b27e610'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('access_token', sa.String(1000), nullable=True))
    pass


def downgrade():
    op.drop_column('user', 'access_token')
    pass
