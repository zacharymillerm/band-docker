#!/bin/bash

# Exit script on any error
set -e

until nc -z -v -w30 "$DB_HOST" "$DB_PORT"; do
  echo "Waiting for database connection at $DB_HOST:$DB_PORT..."
  sleep 5
done

echo "Running migrations..."
php artisan migrate --force

echo "Caching configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Linking storage..."
php artisan storage:link || true  # Prevents failure if symlink already exists

echo "Setting correct permissions..."
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

echo "Starting PHP-FPM..."
exec php-fpm
