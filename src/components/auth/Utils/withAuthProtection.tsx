import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../Authcontext/AuthContext';

// Define the type for the props of the component being passed
interface WithAuthProtectionProps {
  // You can add more props here as needed
}

export function withAuthProtection<T extends WithAuthProtectionProps>(Component: ComponentType<T>) {
  return function ProtectedRoute(props: T) {
    const { userRole, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        // If the user is not logged in or is not an admin, redirect to the homepage
        if (!userRole || userRole !== 'admin') {
          router.push('/');
        }
      }
    }, [userRole, loading, router]);

    // If the user is not ready or not an admin, render nothing or a loading indicator
    if (loading || userRole !== 'admin') {
      return <div>Loading...</div>;
    }

    return <Component {...props} />;
  };
}
