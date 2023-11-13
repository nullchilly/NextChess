"""empty message

Revision ID: 5a680278a836
Revises: 724cf325fcea
Create Date: 2023-11-13 21:48:22.804012

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a680278a836'
down_revision = '724cf325fcea'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('game', sa.Column('slug', sa.String(8), nullable=False))
    pass


def downgrade():
    op.drop_column('game', 'slug')
    pass
