import { useNavigate, Link } from 'react-router-dom';

import { usePocketbase } from '../contexts/PocketbaseContext';
import { FormEvent, useCallback, useRef } from 'react';

export const SignIn = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { login } = usePocketbase();
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(
    async (evt: FormEvent) => {
      evt?.preventDefault();
      await login(emailRef.current!.value, passwordRef.current!.value);
      navigate('/');
    },
    [login],
  );

  return (
    <section>
      <h2>Sign In</h2>
      <form onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="text" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />
        <button type="submit">Login</button>
        <Link to="/">Go to Sign Up</Link>
      </form>
    </section>
  );
};
