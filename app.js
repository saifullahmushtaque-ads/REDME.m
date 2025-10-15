const API_BASE = window.location.origin || 'http://localhost:5000';

async function createPatient(){
  const body = {
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value
  };
  const res = await fetch(API_BASE + '/api/patients', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await res.json();
  alert('Patient created: ' + JSON.stringify(j));
}

async function createAppt(){
  const body = {
    patient_id: parseInt(document.getElementById('patient_id').value),
    appointment_datetime: document.getElementById('appt_dt').value,
    type: document.getElementById('appt_type').value
  };
  const res = await fetch(API_BASE + '/api/appointments', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
  const j = await res.json();
  alert('Appointment created: ' + JSON.stringify(j));
}

async function refresh(){
  const ps = await fetch(API_BASE + '/api/patients').then(r=>r.json());
  const aps = await fetch(API_BASE + '/api/appointments').then(r=>r.json());
  document.getElementById('patients').textContent = JSON.stringify(ps, null, 2);
  document.getElementById('appointments').textContent = JSON.stringify(aps, null, 2);
}

document.getElementById('createPatient').addEventListener('click', createPatient);
document.getElementById('createAppt').addEventListener('click', createAppt);
document.getElementById('refresh').addEventListener('click', refresh);

// initial load
refresh();