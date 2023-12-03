import { usePocketbase } from '../contexts/PocketbaseContext';

export const Dashboard = () => {
  const { logout, user } = usePocketbase();

  return (
    <section>
      <h2>Protected</h2>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <button onClick={logout}>Logout</button>
    </section>
  );
};
