from datetime import datetime, timedelta


def send_whatsapp(to_phone, body):
sid = os.getenv('TWILIO_SID')
token = os.getenv('TWILIO_TOKEN')
from_wa = os.getenv('TWILIO_WHATSAPP_FROM')
if not sid or not TwilioClient or not to_phone or not from_wa:
print('WhatsApp not configured; skipping')
return False
try:
client = TwilioClient(sid, token)
client.messages.create(body=body, from_=from_wa, to=f'whatsapp:{to_phone}')
return True
except Exception as e:
print('WhatsApp send failed:', e)
return False


# ---------- Reminder job ----------


def reminder_job():
now = datetime.utcnow()
# adjust window to your preference; here we pick ~24 hours ahead
window_start = now + timedelta(hours=23)
window_end = now + timedelta(hours=25)
appts = Appointment.query.filter(
Appointment.appointment_datetime >= window_start,
Appointment.appointment_datetime <= window_end,
Appointment.status == 'scheduled',
Appointment.reminder_sent == False
).all()
print(f'Reminder job: found {len(appts)} appointments to process')
for appt in appts:
patient = appt.patient
dt_str = appt.appointment_datetime.strftime('%Y-%m-%d %H:%M UTC')
message = f"Reminder: You have an appointment on {dt_str} (Type: {appt.type}). Please contact to reschedule if needed."
sent_any = False
if patient.email:
if send_email(patient.email, 'Appointment Reminder', message):
sent_any = True
if patient.phone:
if send_twilio_sms(patient.phone, message):
sent_any = True
# Uncomment to try WhatsApp if configured
# if send_whatsapp(patient.phone, message):
# sent_any = True
if sent_any:
appt.reminder_sent = True
DB.session.add(appt)
DB.session.commit()


# Scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=reminder_job, trigger='interval', minutes=int(os.getenv('SCHED_MINUTES', '15')))
scheduler.start()


# ---------- Init ----------
if __name__ == '__main__':
with app.app_context():
DB.create_all()
port = int(os.getenv('PORT', 5000))
app.run(host='0.0.0.0', port=port)