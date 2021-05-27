FROM python:3.8-alpine
WORKDIR /usr/app
#RUN apk add --update nodejs nodejs-npm
COPY ./requirements.txt ./ 
#COPY ./package.json ./ 
#RUN node
#RUN npm install 
RUN apk add --no-cache gcc
RUN apk --no-cache add lapack libstdc++ && apk --no-cache add --virtual .builddeps g++ gcc gfortran musl-dev lapack-dev
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools setuptools wheel
RUN python -m venv dental
RUN source dental/bin/activate
RUN pip install -r requirements.txt
COPY ./ ./
#default command
#CMD ["npm", "run", "start"]
CMD ["python", "Detector.py", "--is_tiny"]