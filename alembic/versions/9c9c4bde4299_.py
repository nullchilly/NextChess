"""empty message

Revision ID: 9c9c4bde4299
Revises: 
Create Date: 2023-11-04 15:34:02.919945

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c9c4bde4299'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.Column('user_name', sa.String(length=50), nullable=False),
    sa.Column('password', sa.String(length=1000), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('registration_date', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'))
    op.create_index('idx_txn_user_email', 'user', ['email'], unique=False)
    pass


def downgrade():
    op.drop_table('user')
    pass

