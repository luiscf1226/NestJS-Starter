#!/bin/sh
# wait-for-db.sh

set -e

host="$1"
shift
cmd="$@"

# Wait for postgres to be ready
until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "postgres" -d "postgres" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

# Create database if it doesn't exist
PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "postgres" -d "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = 'nestjs_db'" | grep -q 1 || \
PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "postgres" -d "postgres" -c "CREATE DATABASE nestjs_db"

# Wait for our database to be ready
until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "postgres" -d "nestjs_db" -c '\q'; do
  >&2 echo "nestjs_db is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"
exec $cmd 