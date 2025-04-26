FROM python:3.11

WORKDIR /backend_shared
COPY backend_shared/ ./
RUN pip install .

WORKDIR /app
# Upgrade pip
RUN python -m pip install --upgrade pip

# Copy and install backend dependencies first
COPY /backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Expose the necessary port
EXPOSE 5000

CMD ["python", "-m", "flask", "--app", "application.py", "run", "--host=0.0.0.0"]