"""create puzzle-duel variant and add number player column to game table

Revision ID: aca32d54543c
Revises: 8f78f537f73a
Create Date: 2023-12-31 17:40:13.932483

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'aca32d54543c'
down_revision = '8f78f537f73a'
branch_labels = None
depends_on = None


def upgrade():
    # add puzzle-duel variant to variants table
    op.execute("INSERT INTO variants (variant_name, description) VALUES ('Puzzle-Duel', 'Puzzle-Duel')")
    # add number player column to game table
    op.add_column('game', sa.Column('number_player', sa.Integer(), nullable=True, default=0))
    pass


def downgrade():
    # remove puzzle-duel variant from variants table
    op.execute("DELETE FROM variants WHERE variant_name='Puzzle-Duel'")
    # remove number player column from game table
    op.drop_column('game', 'number_player')
    pass
