"""empty message

Revision ID: 724cf325fcea
Revises: e2bbcb02cd27
Create Date: 2023-11-13 16:38:44.401094

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '724cf325fcea'
down_revision = 'e2bbcb02cd27'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('game', 'end_at')
    op.add_column('game', sa.Column('time_mode', sa.SmallInteger(), nullable=False))
    pass


def downgrade():
    op.drop_column('game', 'time_mode')
    op.add_column('game', sa.Column('end_at', sa.DateTime(), nullable=True))
    pass
