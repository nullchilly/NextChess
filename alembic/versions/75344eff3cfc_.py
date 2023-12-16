"""empty message

Revision ID: 75344eff3cfc
Revises: 92cbc2204443
Create Date: 2023-12-15 22:09:02.330181

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '75344eff3cfc'
down_revision = '92cbc2204443'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('user', 'date_of_birth')
    op.drop_column('user', 'email')
    op.drop_column('user', 'name')
    op.drop_column('user', 'gender')
    op.drop_column('profile', 'dob')
    op.add_column('profile', sa.Column('date_of_birth', sa.Date(), nullable=True))
    op.add_column('profile', sa.Column('email', sa.VARCHAR(255), nullable=False))
    pass


def downgrade():
    op.add_column('user', sa.Column('date_of_birth', sa.Date(), nullable=True))
    op.add_column('user', sa.Column('email', sa.VARCHAR(255), nullable=False))
    op.add_column('user', sa.Column('name', sa.VARCHAR(255), nullable=False))
    op.add_column('user', sa.Column('gender', sa.VARCHAR(10), default=False))
    op.add_column('profile', sa.Column('dob', sa.DateTime(), default=False))
    op.drop_column('profile', 'date_of_birth')
    op.drop_column('profile', 'email')
    pass
