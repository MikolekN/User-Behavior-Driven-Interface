FROM python:3.11

RUN python -m pip install --upgrade pip

WORKDIR /backend_shared
COPY backend_shared/ ./
RUN pip install .

WORKDIR /app

COPY /event_backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5005

CMD ["python", "-m", "flask", "--app", "application.py", "run", "--host=0.0.0.0", "-p", "5005"]