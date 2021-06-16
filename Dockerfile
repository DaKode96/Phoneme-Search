FROM python:3.9

WORKDIR /opt/app

COPY . .

RUN pip install flask

RUN useradd py

USER py

CMD python3 backend.py