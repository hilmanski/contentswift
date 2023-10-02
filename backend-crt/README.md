
This is the README for `backend-crt` part

## Dev
Make sure you've opened your `Docker application`

Run
```
docker-compose up -d --build
```

## Install new py package

Go to source folder
```
cd src
```

Create virtual env
```
python3 -m venv env
# or Windows
py -m venv env
```

Activating a virtual env
```
source env/bin/activate
# or Windows
.\env\Scripts\activate
```

```
pip install packageName 
```

or pip3

Update req
```
pip freeze > requirements.txt
```

Restart might be required