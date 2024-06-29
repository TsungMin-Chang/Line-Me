# podman volume rm --force pg-data2
# podman volume create pg-data2
podman run -d -it --replace \
  --name lineme \
  -e POSTGRES_DB=lineme \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e PGDATA=/var/lib/postgresql/data \
  -v pg-data2:/var/lib/postgresql/data:z \
  -p 127.0.0.1:4998:5432 \
  postgres:16
