# Change professionindustry to string

# Revision ID: 5a962beaa91e  <-- This line is causing the error; it's not valid Python syntax

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5a962beaa91e'  # Correct way to define revision ID
down_revision = '46f5b3062eac'  # Make sure this matches the previous revision ID
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('users', 'professionindustry',
                    existing_type=sa.ARRAY(sa.String()),  # Existing array type
                    type_=sa.String(),  # Change to String
                    existing_nullable=True)

def downgrade():
    op.alter_column('users', 'professionindustry',
                    existing_type=sa.String(),
                    type_=sa.ARRAY(sa.String()),  # Revert to array if downgrading
                    existing_nullable=True)
