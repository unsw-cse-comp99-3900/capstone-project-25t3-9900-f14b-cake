#  manage_docker.py Usage Guide

###  File
`backend/manage_docker.py`

---

##  Usage

```bash
./manage_docker.py [command] [args]
```

###  Available Commands

| Command | Description |
|----------|-------------|
| `start` | Start backend + database containers |
| `stop` | Stop all containers |
| `reset` | Remove containers and volumes, rebuild everything |
| `initdb` | Initialize database schema inside backend container |
| `reset_db` | Drop all tables and recreate them |
| `status` | Show container status |
| `logs` | Follow backend logs |
| `test` | Run all unit tests inside the container |
| `run [path]` | Run a specific Python file inside the container (e.g. `app/tests/test.py`) |
| `help` | Show this help message |


---  