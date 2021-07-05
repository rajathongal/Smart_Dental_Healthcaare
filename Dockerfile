FROM python:3.7-slim
#RUN useradd -ms /bin/bash admin
USER root
WORKDIR /usr/app
RUN mkdir -p -v runs/detect
# RUN mkdir -p -v Data/Source_Images/Test_Image_Detection_Results
#RUN apk install --update nodejs nodejs-npm
#RUN chown -R admin:admin /usr/app
#RUN chmod 777 /usr/app

COPY ./requirements.txt ./ 
ENV VIRTUAL_ENV=dental
#COPY ./package.json ./ 
#RUN node
#RUN npm install 
#RUN apt-get install lapack libstdc++ && apt-get install .builddeps g++ gcc gfortran musl-dev lapack-dev
# RUN pip install --upgrade pip
# RUN pip install --upgrade setuptools setuptools wheel
# RUN apt-get install software-properties-common
# RUN apt-add-repository universe
RUN apt-get update
# RUN apt-get install python-dev
# RUN apt-get install build-essential
RUN pip install --upgrade pip setuptools
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
# RUN /dental/bin/activate
RUN apt-get install -y gcc g++
RUN python -m pip install wheel
RUN pip install -r requirements.txt
RUN apt-get install ffmpeg libsm6 libxext6  -y
# RUN python -c "import cv2"
COPY ./ ./
#default command
#CMD ["npm", "run", "start"]
# RUN cd 3_Inference
# RUN ls
# RUN python ./3_Inference/Detector.py --is_tiny
ENV http_proxy=http
# ENV https_proxy=http
# setup dependencies
RUN apt-get update --fix-missing
RUN apt-get install xz-utils --fix-missing
RUN apt-get -y install curl

# # Download latest nodejs binary
# RUN curl https://nodejs.org/dist/v14.15.4/node-v14.15.4-linux-x64.tar.xz -O

# # Extract & install
# RUN tar -xf node-v14.15.4-linux-x64.tar.xz
# RUN ln -s /node-v14.15.4-linux-x64/bin/node /usr/local/bin/node
# RUN ln -s /node-v14.15.4-linux-x64/bin/npm /usr/local/bin/npm
# RUN ln -s /node-v14.15.4-linux-x64/bin/npx /usr/local/bin/npx
# RUN apt-get install nodejs nodejs-npm
# RUN /usr/local/bin/npm install
#RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - 
RUN apt-get install -y nodejs
RUN apt-get install -y npm
RUN apt-get update -y
RUN npm install
CMD ["npm", "run", "start:prod"]