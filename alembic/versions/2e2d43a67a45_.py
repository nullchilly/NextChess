"""empty message

Revision ID: 2e2d43a67a45
Revises: 12347a3f4269
Create Date: 2023-12-30 17:45:17.574366

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e2d43a67a45'
down_revision = '12347a3f4269'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('game_user', sa.Column('rating_change', sa.Integer(), nullable=False))
    op.drop_table('user_rating')
    pass


def downgrade():
    op.drop_column('game_user', 'rating_change')
    op.create_table('user_rating',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('rating', sa.Integer(), nullable=False),
                    sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
                    sa.Column('deleted_at', sa.DateTime(), nullable=True),
                    sa.PrimaryKeyConstraint('id'))
    pass
