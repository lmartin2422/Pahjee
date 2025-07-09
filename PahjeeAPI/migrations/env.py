import sys
import os
from logging.config import fileConfig

# Add the 'Pahjee' project directory to sys.path to ensure Alembic can find the 'PahjeeAPI' module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..')))  # Add the parent directory

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from Pahjee.PahjeeAPI import models  # Correct the import path based on your project structure

# This is the Alembic Config object, which provides access to the values within the .ini file in use.
config = context.config

# Tell Alembic which models to track for migrations
target_metadata = models.Base.metadata  # Ensure Alembic knows the metadata

# Create the engine from the config using the database URL defined in alembic.ini
connectable = engine_from_config(
    config.get_section(config.config_ini_section),
    prefix="sqlalchemy.",
    poolclass=pool.NullPool,
)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

# Run migrations based on whether we're offline or online
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
