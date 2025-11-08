#!/usr/bin/env python3
import os
import subprocess
import sys
import socket
import time

COMPOSE_FILE = "docker-compose.yml"
BACKEND_CONTAINER = "backend_app"


def run_command(cmd: str):
    """Run a shell command and handle errors gracefully."""
    try:
        subprocess.run(cmd, shell=True, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {e}")
        sys.exit(1)


def start():
    """Start backend and database containers."""
    print("Starting backend and database containers...")
    run_command(f"docker compose -f {COMPOSE_FILE} up -d")
    print("All services are up and running.")


def stop():
    """Stop all containers."""
    print("Stopping all containers...")
    run_command(f"docker compose -f {COMPOSE_FILE} down")
    print("All containers stopped.")


# def reset():
#     """Completely remove containers and volumes, then rebuild."""
#     print("Performing full reset (containers + volumes)...")
#     run_command(f"docker compose -f {COMPOSE_FILE} down -v")
#     print("Rebuilding and restarting containers...")
#     run_command(f"docker compose -f {COMPOSE_FILE} up -d --build")
#     print("Reset completed.")
def is_port_in_use(port: int) -> bool:
    """Check if a given port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0


def reset():
    """Completely remove containers and volumes, then rebuild."""
    print("Performing full reset (containers + volumes)...")
    run_command(f"docker compose -f {COMPOSE_FILE} down -v")

    # 等待端口释放
    port = 9000
    print(f"Checking if port {port} is free...")
    for _ in range(10):
        if not is_port_in_use(port):
            print(f"Port {port} is free.")
            break
        print(f"Port {port} still in use, waiting...")
        time.sleep(2)
    else:
        print(f"Warning: Port {port} still occupied. Try restarting Docker manually.")
        sys.exit(1)

    print("Rebuilding and restarting containers...")
    run_command(f"docker compose -f {COMPOSE_FILE} up -d --build")
    print("Reset completed successfully.")

def init_db():
    """Create tables if not exist (safe)."""
    print("Initializing database (create only)...")
    run_command(f"docker exec -it {BACKEND_CONTAINER} python -m app.db.db_init")
    print("Loading default badge data...")
    run_command(f"docker exec -it {BACKEND_CONTAINER} python -m app.db.init_badges")

def reset_db():
    """Drop all tables and recreate them."""
    print("Resetting database (drop + create)...")
    run_command(f"docker exec -it {BACKEND_CONTAINER} python -m app.db.db_init reset")


def status():
    """Show running container status."""
    print("Current Docker containers:")
    run_command("docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'")


def logs():
    """Follow backend logs."""
    print("Following backend logs (Ctrl+C to stop)...")
    run_command(f"docker logs {BACKEND_CONTAINER} -f")


def test():
    """Run all backend unit tests inside the container."""
    print("Running unit tests inside backend container...")
    run_command(f"docker exec -it {BACKEND_CONTAINER} python -m unittest discover -s app/tests")
    print("Tests completed.")


def run_file(file_path):
    """
    Run a Python file inside the backend container.
    Automatically converts path to module form (e.g. app/tests/test.py -> app.tests.test)
    and sets PYTHONPATH for correct package imports.
    """
    if not file_path.endswith(".py"):
        print("Please provide a valid Python file path, e.g. app/tests/test.py")
        sys.exit(1)

    # Normalize path (remove leading ./)
    file_path = file_path.strip().lstrip("./")

    # Convert to module path
    module_path = file_path.replace("/", ".").replace(".py", "")

    print(f"Running module '{module_path}' inside container '{BACKEND_CONTAINER}'...")

    # Command ensures correct Python path for absolute imports
    cmd = (
        f"docker exec -it -e PYTHONPATH=/usr/src/app "
        f"{BACKEND_CONTAINER} python -m {module_path}"
    )

    run_command(cmd)
    print("Execution finished.")


def show_help():
    """Display command usage."""
    print("""
Usage: ./manage_docker.py [command] [args]

Available commands:
  start               Start backend + database containers
  stop                Stop all containers
  reset               Remove containers and volumes, rebuild everything
  initdb              Initialize database schema inside backend container
  reset_db            Drop all tables and recreate them.
  status              Show container status
  logs                Follow backend logs
  test                Run all unit tests inside the container
  run [path]          Run a specific Python file inside the container (e.g. app/tests/test.py)
  help                Show this help message
""")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        show_help()
        sys.exit(0)

    command = sys.argv[1].lower()

    if command == "start":
        start()
        init_db()
    elif command == "stop":
        stop()
    elif command == "reset":
        reset()
        reset_db()
        init_db()
    elif command == "initdb":
        init_db()
    elif command == "reset_db":
        reset_db()
        init_db()
    elif command == "status":
        status()
    elif command == "logs":
        logs()
    elif command == "test":
        test()
    elif command == "run":
        if len(sys.argv) < 3:
            print("Missing file path. Example: ./manage_docker.py run app/tests/test.py")
            sys.exit(1)
        run_file(sys.argv[2])
    else:
        show_help()
