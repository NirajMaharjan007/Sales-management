# Sales-management

- Information for the project

  - Frontend Angular
  - Backend Django

- How to run the project
  - Database -> MySql
    - Create a database named `sales_management`
  - Run the backend server
  - Run the frontend server

## Backend

- Python-version -> 3.11^
- pip -> 24.0^

- Install the dependencies

  - `cd back-end`
  - `pip install mysqlclient`
  - `pip install Pillow`
  - `pip install django-cors-headers`
  - `pip install djangorestframework`
  - `pip install drf-yasg`
  - `pip install Django==4.2.14`

- Run the backend server
  - `python manage.py makemigrations api`
  - `python manage.py migrate`
  - `python manage.py runserver`

## Frontend

- npm-version -> 10.9.0
- angular-version -> 18^
- Install the dependencies

  - `cd front-end`
  - `npm install @angular/cli -g`
  - `npm install`

- Run the frontend server
  - `ng serve`
