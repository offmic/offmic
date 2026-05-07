# OffMic landing — deploy

The landing in `../site/` is a static HTML page. This folder deploys it as an `nginx:alpine` container on the shared VPS, fronted by nginx-proxy-manager.

## Deploy

On the VPS:

```bash
# 1. Sync site + deploy files to /home/nodkon/offmic/
rsync -avz --delete -e "ssh -p 2222" site/ nodkon@vps:/home/nodkon/offmic/site/
scp -P 2222 deploy/nginx-default.conf nodkon@vps:/home/nodkon/offmic/.nginx-default.conf
scp -P 2222 deploy/docker-compose.yml nodkon@vps:/home/nodkon/offmic/docker-compose.yml

# 2. Start the container
ssh -p 2222 nodkon@vps 'cd /home/nodkon/offmic && docker compose up -d'
```

## Proxy + TLS

In nginx-proxy-manager (jc21) admin UI:

1. **Add Proxy Host**
2. Domain Names: `offmic.org`, `www.offmic.org`
3. Forward Hostname/IP: `offmic-web`
4. Forward Port: `80`
5. Block Common Exploits: ON
6. **SSL tab** → request Let's Encrypt cert, enable Force SSL + HTTP/2 + HSTS

## DNS

At the registrar:

| Type | Host | Value |
|---|---|---|
| A | @ | `<VPS public IP>` |
| A | www | `<VPS public IP>` |
| CAA | @ | `0 issue "letsencrypt.org"` |

## Update

After editing files in `../site/`:

```bash
rsync -avz --delete -e "ssh -p 2222" site/ nodkon@vps:/home/nodkon/offmic/site/
# nginx serves the updated files immediately, no restart needed
```
