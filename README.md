# CS179G
 Senior Design Project - Chicago Crime Analysis and Prediction

Contributors:
Neha Gutapalli || Tanya Carillo || Eric Via || Arleen Kaur || Jade Someda

This project focuses on Big Data Analysis, by analyzing a Crime Dataset that contains 14 million cases in Chicago. By exploring this data, insightful inferences can generated in order to better understand how to mitigate crime and provide helpful solutions. By identifying patterns predictions can be created.

### Running the web app (React + Flask)

1. **Backend (Flask API):** From the project root, run:
   ```bash
   python3 app.py --host=127.0.0.1 --port=5000
   ```
   Ensure MySQL is running and the `cs179g` database has the required tables.

2. **Frontend (React):** In another terminal:
   ```bash
   cd frontend && npm install && npm run dev
   ```
   Open http://localhost:5173. The Vite dev server proxies `/api` to Flask on port 5000.
