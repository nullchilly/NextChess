"""empty message

Revision ID: 8f78f537f73a
Revises: 2e2d43a67a45
Create Date: 2023-12-30 21:58:31.716119

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f78f537f73a'
down_revision = '2e2d43a67a45'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('puzzle_user', 'gained_rating')
    op.add_column('puzzle_user', sa.Column('gained_rating', sa.Integer(), nullable=False, default=0))
    pass


def downgrade():
    op.drop_column('puzzle_user', 'gained_rating')
    op.add_column('puzzle_user', sa.Column('gained_rating', sa.Boolean(), nullable=False))
    pass
