FROM python:3.8-slim
WORKDIR /usr/app
#RUN apk install --update nodejs nodejs-npm
COPY ./requirements.txt ./ 
ENV VIRTUAL_ENV=dental
#COPY ./package.json ./ 
#RUN node
#RUN npm install 
#RUN apt-get install lapack libstdc++ && apt-get install .builddeps g++ gcc gfortran musl-dev lapack-dev
# RUN pip install --upgrade pip
# RUN pip install --upgrade setuptools setuptools wheel
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# RUN /dental/bin/activate
RUN pip install -r requirements.txt
COPY ./ ./
#default command
#CMD ["npm", "run", "start"]
CMD ["python", "Detector.py", "--is_tiny"]