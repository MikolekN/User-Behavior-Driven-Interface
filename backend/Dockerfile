FROM python:3.11

WORKDIR /app

RUN python -m pip install --upgrade pip
COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "application.py"]
