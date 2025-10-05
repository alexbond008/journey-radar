FROM python:3.13-alpine

WORKDIR /app

# Install uv
RUN pip install uv

COPY pyproject.toml uv.lock* ./

RUN uv sync --no-cache --no-dev

COPY . .

# Command to run the application using uv run
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]