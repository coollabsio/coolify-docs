# SurrealDB

SurrealDB is a multi-model database. Coolify provides one-click templates for:

- SurrealDB (RocksDB)
- SurrealDB (TiKV)

## Deploy in Coolify
1. In Coolify: New Resource → Service
2. Select the SurrealDB template (RocksDB or TiKV)
3. Deploy and wait until the service is Running/Healthy

## Verify
- SurrealDB should be reachable on port 8000 (if exposed)
- Run a basic query via the SQL HTTP endpoint:

```bash
curl -sS -X POST \
  -u "<USER>:<PASS>" \
  -H "NS: <NAMESPACE>" \
  -H "DB: <DATABASE>" \
  --data "INFO FOR DB;" \
  "http://<HOST>:<PORT>/sql"
