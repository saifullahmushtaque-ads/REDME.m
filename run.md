Local run (no docker):
1. cd backend
2. cp .env.example .env  (fill values)
3. python -m venv venv
4. source venv/bin/activate  (Windows: venv\\Scripts\\activate)
5. pip install -r requirements.txt
6. python app.py
7. Open frontend/index.html in browser OR serve frontend with a simple static server (python -m http.server 5500 in frontend folder) and point to http://localhost:5500

Docker run:
1. docker-compose up --build
2. Backend: http://localhost:5000
3. Frontend: http://localhost:5500

Testing reminders quickly:
- Create a patient.
- Create an appointment ~24 hours ahead (or modify SCHED_MINUTES and the reminder window in app.py for faster testing).
- Check backend logs: the scheduler prints what it processed, and the appointment row gets reminder_sent=true when it sends.