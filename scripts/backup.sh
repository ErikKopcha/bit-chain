#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p backups

# Create timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Backup filename
BACKUP_FILE="backups/trading_journal_${TIMESTAMP}.sql"

# Perform the backup
pg_dump -U dx -h localhost -d trading_journal > $BACKUP_FILE

# Compress the backup
gzip $BACKUP_FILE

echo "Backup created: ${BACKUP_FILE}.gz" 