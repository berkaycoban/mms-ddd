docker compose -f docker-compose.beta.yml pull
docker compose -f docker-compose.beta.yml build --no-cache
docker compose -f docker-compose.beta.yml up -d