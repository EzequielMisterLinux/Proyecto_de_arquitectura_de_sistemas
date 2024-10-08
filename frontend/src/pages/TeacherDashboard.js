import { Header } from '../components/Header';
import { io } from 'socket.io-client';

export const TeacherDashboard = () => {
  const page = document.createElement('div');
  page.className = 'bg-gradient-to-r from-green-100 to-blue-100 min-h-screen p-6';

  page.appendChild(Header());

  const content = document.createElement('div');
  content.className = 'max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6';
  content.innerHTML = '<h1 class="text-3xl font-bold text-gray-800 mb-6">Teacher Dashboard</h1>';

  page.appendChild(content);

  // Form to create new attendance session
  const form = document.createElement('form');
  form.className = 'space-y-4 mb-8';
  form.innerHTML = `
    <div>
      <label for="sessionName" class="block text-sm font-medium text-gray-700">Session Name</label>
      <input type="text" id="sessionName" name="sessionName" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
    </div>
    <div>
      <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
      <input type="date" id="date" name="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
    </div>
    <div>
      <label for="startTime" class="block text-sm font-medium text-gray-700">Start Time</label>
      <input type="time" id="startTime" name="startTime" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
    </div>
    <div>
      <label for="endTime" class="block text-sm font-medium text-gray-700">End Time</label>
      <input type="time" id="endTime" name="endTime" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
    </div>
    <div>
      <label for="createdBy" class="block text-sm font-medium text-gray-700">Teacher Name</label>
      <input type="text" id="createdBy" name="createdBy" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500" required />
    </div>
    <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out">Create Attendance Session</button>
  `;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('http://localhost:3000/api/attendance-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showNotification('Attendance session created successfully');
        // Emit socket event to notify students
        const socket = io('http://localhost:3000');
        socket.emit('new_attendance_session', data);
        fetchSessions(); // Refresh the list
        form.reset(); // Clear the form
      }
    } catch (error) {
      console.error('Error creating attendance session:', error);
      showNotification('Failed to create attendance session', 'error');
    }
  };

  content.appendChild(form);

  // Display list of attendance sessions
  const sessionList = document.createElement('div');
  sessionList.id = 'session-list';
  sessionList.className = 'space-y-4';
  content.appendChild(sessionList);

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/attendance-sessions');
      const sessions = await response.json();
      sessionList.innerHTML = '';
      sessions.forEach(session => {
        const sessionItem = document.createElement('div');
        sessionItem.className = 'bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition duration-300 ease-in-out transform hover:scale-102 hover:shadow-md';
        sessionItem.innerHTML = `
          <h3 class="text-xl font-semibold text-gray-800 mb-2">${session.sessionName}</h3>
          <p class="text-gray-600"><span class="font-medium">Date:</span> ${new Date(session.date).toLocaleDateString()}</p>
          <p class="text-gray-600"><span class="font-medium">Time:</span> ${session.startTime} - ${session.endTime}</p>
          <p class="text-gray-600"><span class="font-medium">Created By:</span> ${session.createdBy}</p>
          <div class="mt-4">
            <button class="view-attendances bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out">View Attendances</button>
          </div>
        `;

        const viewButton = sessionItem.querySelector('.view-attendances');
        viewButton.onclick = () => {
          showAttendances(session._id);
        };

        sessionList.appendChild(sessionItem);
      });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showNotification('Failed to fetch sessions', 'error');
    }
  };

  const showAttendances = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/attendances/${sessionId}`);
      const attendances = await response.json();

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center';
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
          <h2 class="text-2xl font-bold mb-4">Attendances</h2>
          <ul class="space-y-2">
            ${attendances.map(a => `<li class="p-2 bg-gray-100 rounded">${a.student} - ${a.present ? 'Present' : 'Absent'}</li>`).join('')}
          </ul>
          <button class="close-modal mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Close</button>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('.close-modal').onclick = () => {
        modal.remove();
      };
    } catch (error) {
      console.error('Error fetching attendances:', error);
      showNotification('Failed to fetch attendances', 'error');
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

  // Set up real-time updates
  const socket = io('http://localhost:3000');
  
  socket.on('attendance_marked', (data) => {
    showNotification(`${data.studentName} marked attendance for session ${data.sessionId}`);
    fetchSessions(); // Refresh the list to show updated attendance count
  });

  setInterval(fetchSessions, 30000); // Refresh every 30 seconds

  return page;
};