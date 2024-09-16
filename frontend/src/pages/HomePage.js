import { Header } from '../components/Header';
import { UserList } from '../components/UserList';
import { UserModal } from '../components/UserModal';

export const HomePage = async () => {
  const page = document.createElement('div');
  page.className = 'min-h-screen bg-gray-100';

  const header = Header();
  const userList = await UserList();

  const addUserButton = document.createElement('button');

  addUserButton.addEventListener('click', () => {
    const modal = UserModal('add', {}, () => {
      document.body.removeChild(modal);
    });
    document.body.appendChild(modal);
  });

  page.appendChild(header);
  page.appendChild(addUserButton);
  page.appendChild(userList);

  return page;
};
