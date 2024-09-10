FROM python:3.12

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

RUN pip install --no-cache-dir --default-timeout=1000 -r /code/requirements.txt

COPY ./app /code/app

EXPOSE 8080

WORKDIR /code/app

CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]