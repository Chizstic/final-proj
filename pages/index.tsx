import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginPage from './login';
import SignUpPage from './signup';
import AdminPage from './admin';
import Bookers from './books';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
    router.push('/signup');
    router.push('/admin');
    router.push('/books');
  }, [router]);

  return <p>Redirecting to login...</p>;
};

export default HomePage;
