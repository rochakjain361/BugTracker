# BugTracker
IMG Summer Project

## Set Up Instructions for Backend
* Clone this repository to a folder on your device.
* Set up a virtual environment and activate it
* Use the following command to install all the necessary dependencies:
```
pip install -r requirements.txt
```
(using Python version 3.6.9 in virtual environment)
* Create a MySQL Database name ```bugtracker_data``` (the name of the database can be changed to something else too, but for that update the settings.py in the IMG_Summer_Project folder)
* From the root directory execute the following commands:
1. ```cd configuration``` <br>
2. ```vi config.yml``` <br>
** Fill out the information in that .yml file. <b>All the values should be filled here in order for the app to work</b> 
* In the root directory of the project, Run:-
1. ```python manage.py makemigrations``` <br>
2. ```python manage.py migrate``` <br>
3. ```redis-server``` <br>
4. ```python manage.py runserver``` this runs the server. <br> 
* Tags in the App should be added manually by the setup setter. You can either populate the database with tags by going to <a href=" http://127.0.0.1:8000/tags/"> http://127.0.0.1:8000/tags/</a> or otherwise you should be admin in the app to add more tags<br>
* Backend is now ready for the roll.<br>

## Set Up Intructions for frontend
* From the root directory of the project switch to frontend, then execute the following commands:
1. ```cd frontend``` <br>
2. ```npm install``` installs all the dependencies required <br>
3. ```npm start``` starts the frontend server <br>
'For the frontend app to work, you must have the backend server running'
