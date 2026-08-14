import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/userdashboard#profile', { replace: true });
  }, [navigate]);

  return null;
};

export default ChangePassword;
