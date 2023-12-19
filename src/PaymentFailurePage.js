// PaymentFailurePage.jsx
import { useNavigate } from 'react-router-dom';

const PaymentFailurePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>There was an issue processing your payment. Please try again.</p>
      <button onClick={() => navigate('/payment')}>Retry Payment</button>
      <button onClick={() => navigate('/')}>Go Back to Store</button>
    </div>
  );
};

export default PaymentFailurePage;
