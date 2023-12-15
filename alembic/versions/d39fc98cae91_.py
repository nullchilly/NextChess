"""empty message

Revision ID: d39fc98cae91
Revises: 75344eff3cfc
Create Date: 2023-12-15 22:31:03.075997

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd39fc98cae91'
down_revision = '75344eff3cfc'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user_rating',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('rating', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'))
    pass


def downgrade():
    op.drop_table('user_rating')
    pass
