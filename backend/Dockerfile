# Stage 1: Build
FROM php:8.2-fpm AS builder

WORKDIR /var/www

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    unzip \
    libpq-dev \
    libonig-dev \
    libzip-dev \
    zip \
    curl \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress

# Stage 2: Production Image
FROM php:8.2-fpm

WORKDIR /var/www

# Copy necessary files from builder stage
COPY --from=builder /var/www/vendor /var/www/vendor
COPY --from=builder /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Expose port
EXPOSE 9000

# Copy entrypoint script
COPY entrypoint.sh /var/www/entrypoint.sh
RUN chmod +x /var/www/entrypoint.sh

CMD ["/var/www/entrypoint.sh"]