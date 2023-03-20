DB_CONTAINER=flashswipe_db_container

build:
	cargo build

stop_existing_container:
	@echo "Checking active containers"
	if [ $$(docker ps -q) ]; then \
		echo "Found active containers..."
		echo "Stopping them..."
		docker stop $$(docker ps -q); \
	fi

check_if_container_exists:
	@echo "Checking if container with the name: $(DB_CONTAINER) exists"
	if [ $$( docker ps -a | grep ${DB_CONTAINER} | wc -l ) -gt 0 ]; then \
		echo "Container $(DB_CONTAINER) Exists! Do you want to delete it? [Y/N]"; \
		read -r RESPONSE; \
		if [ "$$RESPONSE" == "Y" ]; then \
			echo "Removing container $(DB_CONTAINER)";\
			make remove_docker_container;\
			make create_db_container;\
			make start_db_container;\
			until docker exec $(DB_CONTAINER) psql --username=root  -c "SELECT 1" > /dev/null 2>&1; do \
				echo "PostgreSQL server not available yet. Retrying in 5 seconds..."; \
				sleep 5; \
			done; \
			make create_db;\
		else \
			make start_db_container;\
		fi;\
	fi

create_db_container:
	@echo "Creating container: " + ${DB_CONTAINER}
	docker run --name ${DB_CONTAINER} -p 5432:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=secret -d postgres:12-alpine
	
remove_docker_container:
	docker rm --force ${DB_CONTAINER}

create_db:
	docker exec -it ${DB_CONTAINER} createdb --username=root --owner=root flashswipe_db

start_db_container:
	docker start ${DB_CONTAINER} 

create_migration:
	@echo "Manual: Creating migration..."
	sqlx migrate add -r init

migrate_up:
	@echo "Manual: Migrating..."
	sqlx migrate run

migrate_down:
	@echo "Manual: Removing migration..."
	sqlx migrate revert

run: 
	cargo run

# check if any container with the name exist, if it does, delete the damn thing
init_db: check_if_container_exists start_db_container 

init_docker: stop_existing_container start_db_container


