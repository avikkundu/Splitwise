
## Setup

git clone repository  
cd splitwise  
docker compose up --build


for ony frontend ::

cd splitwise/frontend/splitwise-ui  
npm install  
npm start

for backend :: 

 runs inside sandbox venv    

 venv\Scripts\activate    
 npm install fastapi uvicorn sqlalchemy psycopg2-binary pydantic    
 uvicorn main:app --reload       

 For adding users: 

 docker exec -it splitwise-db psql -U postgres -d splitwise
 INSERT INTO users (name) VALUES
('Alice'),
('Bob'),
('Rohit');


 ### Assumptions ::

 users are already present /created.

 ### API endpoints

 http://127.0.0.1:8000/groups  
 http://127.0.0.1:8000/groups/{group_id}  
 http://127.0.0.1:8000/groups/{group_id}/expenses  
  http://127.0.0.1:8000/groups/{group_id}/balances  
  http://127.0.0.1:8000/users/{user_id}/expenses  
 
 
 
