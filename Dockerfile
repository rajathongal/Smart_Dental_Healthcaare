FROM python:3.8-alpine
WORKDIR /usr/app
#RUN apk add --update nodejs nodejs-npm
COPY ./requirements.txt ./ 
#COPY ./package.json ./ 
#RUN node
#RUN npm install 
RUN apk add --no-cache gcc
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools
RUN python -m venv dental
RUN ./dental/Scripts/activate
RUN pip install -r requirements.txt
COPY ./ ./
#default command
#CMD ["npm", "run", "start"]
CMD ["python", "Detector.py", "--is_tiny"]