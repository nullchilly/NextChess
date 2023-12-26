"""empty message

Revision ID: 12347a3f4269
Revises: d39fc98cae91
Create Date: 2023-12-26 15:12:30.789243

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '12347a3f4269'
down_revision = 'd39fc98cae91'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('user_rating', sa.Column('variant_id', sa.Integer(), nullable=False))
    pass


def downgrade():
    op.drop_column('user_rating', 'variant_id')
    pass
