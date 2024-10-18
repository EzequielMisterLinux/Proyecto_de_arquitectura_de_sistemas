import { Header } from '../components/Header';
import { io } from 'socket.io-client';
import { getCurrentApellidos, getCurrentUsername } from '../services/api';

export const StudentDashboard = () => {
  const page = document.createElement('div');
  page.className = 'bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen p-6';

  page.appendChild(Header());

  const content = document.createElement('div');
  content.className = 'max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6';
  content.innerHTML = '<h1 class="text-3xl font-bold text-gray-800 mb-6">Student Dashboard</h1>';

  const sessionList = document.createElement('div');
  sessionList.id = 'session-list';
  sessionList.className = 'space-y-4';
  content.appendChild(sessionList);

  page.appendChild(content);

  const socket = io('http://localhost:3000');

  socket.on('new_attendance_session', (session) => {
    addSessionToList(session);
    showNotification('New attendance session available!');
  });

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/attendance-sessions');
      const sessions = await response.json();
      sessionList.innerHTML = '';
      for (const session of sessions) {
        await addSessionToList(session);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showNotification('Failed to fetch sessions', 'error');
    }
  };

  const addSessionToList = async (session) => {
    const sessionItem = document.createElement('div');
    sessionItem.className = 'bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition duration-300 ease-in-out transform hover:scale-102 hover:shadow-md';
    
    let fecha = new Date(session.date);
    let formattedDate = `${fecha.getDate() + 1}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;

    let nombres = getCurrentUsername()
    let apellidos = getCurrentApellidos()
    const studentName = `${nombres} ${apellidos}`;

    const attendanceStatus = await checkAttendanceStatus(session._id, studentName);

    sessionItem.innerHTML = `
      <h3 class="text-xl font-semibold text-gray-800 mb-2">${session.sessionName}</h3>
      <p class="text-gray-600"><span class="font-medium">Date:</span> ${formattedDate}</p>
      <p class="text-gray-600"><span class="font-medium">Time:</span> ${session.startTime} - ${session.endTime}</p>
      <div class="mt-4">
        <input type="text" placeholder="Your Name" id="student-name-${session._id}" class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" value="${studentName}" readonly required>
        <button class="mark-attendance mt-2 w-full ${attendanceStatus ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">${attendanceStatus ? 'Attendance Marked' : 'Mark Attendance'}</button>
      </div>
    `;

    const markButton = sessionItem.querySelector('.mark-attendance');
    const studentNameInput = sessionItem.querySelector(`#student-name-${session._id}`);

    if (attendanceStatus) {
      markButton.disabled = true;
      studentNameInput.disabled = true;
    } else {
      markButton.onclick = async () => {
        if (!studentName) {
          showNotification('Please enter your name', 'error');
          return;
        }

        try {
          const response = await fetch('http://localhost:3000/api/attendances', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              session: session._id,
              student: studentName,
              present: true
            }),
          });

          if (response.ok) {
            showNotification('Attendance marked successfully');
            markButton.disabled = true;
            markButton.textContent = 'Attendance Marked';
            markButton.className = 'mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md cursor-not-allowed';
            studentNameInput.disabled = true;

            socket.emit('attendance_marked', { sessionId: session._id, studentName });
          }
        } catch (error) {
          console.error('Error marking attendance:', error);
          showNotification('Failed to mark attendance', 'error');
        }
      };
    }

    sessionList.appendChild(sessionItem);
  };

  const checkAttendanceStatus = async (sessionId, studentName) => {
    try {
      const response = await fetch(`http://localhost:3000/api/attendances?session=${sessionId}&student=${encodeURIComponent(studentName)}`);
      const attendances = await response.json();
      return attendances.some(a => a.student === studentName && a.session._id === sessionId);
    } catch (error) {
      console.error('Error checking attendance status:', error);
      return false;
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-md text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } transition-opacity duration-500 ease-in-out`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  fetchSessions();

  setInterval(fetchSessions, 30000);

  return page;
};