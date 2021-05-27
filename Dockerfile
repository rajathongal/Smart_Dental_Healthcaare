FROM python:3.6-slim
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
RUN apt-get install python-dev
RUN apt-get install build-essential
RUN pip install --upgrade pip setuptools
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# RUN /dental/bin/activate
RUN pip install -r requirements.txt
COPY ./ ./
#default command
#CMD ["npm", "run", "start"]
RUN cd 3_Inference
RUN ls
RUN python ./3_Inference/Detector.py --is_tiny
CMD ["python", "Detector.py", "--is_tiny"]