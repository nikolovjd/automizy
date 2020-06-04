# Automizy Dev Test
## Adatbázis
### Alapkövetelmény
Docker 19.03.9

### Függőségek telepítése
https://docs.docker.com/compose/install/

```
curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
```
chmod +x /usr/local/bin/docker-compose
```

### Adatbázis konténer indítása
```
docker-compose up
```
### Futás ellenörzése
```
docker images
```
```
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
percona             latest              0128954d5b0f        6 weeks ago         597MB
```