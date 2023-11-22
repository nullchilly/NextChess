"""add_rating_and_streak

Revision ID: 281359f35c76
Revises: f89c0ca39f21
Create Date: 2023-11-22 21:23:22.643093

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '281359f35c76'
down_revision = 'f89c0ca39f21'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user', sa.Column('streak', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('user', sa.Column('longest_streak', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('user', sa.Column('last_streak', sa.Integer(), nullable=False, server_default='0'))
    pass


def downgrade():
    op.drop_column('user', 'streak')
    op.drop_column('user', 'longest_streak')
    op.drop_column('user', 'last_streak')
    pass
