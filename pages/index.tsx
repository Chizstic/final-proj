import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const HomePage = () => {
  const router = useRouter();
  const {user} = useAuth();
  useEffect(() => {
    if (user) {
      if(user.role == 'admin') {
        router.push("/admin");
      } 
      else if(user.role == 'client'){
        router.push("/homepage");
      }
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return <p>Redirecting to login...</p>;
};

export default HomePage;
