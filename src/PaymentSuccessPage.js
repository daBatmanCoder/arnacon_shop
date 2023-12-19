// PaymentSuccessPage.jsx
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Your payment was processed successfully.</p>
      <button onClick={() => navigate('/')}>Go Back to Store</button>
    </div>
  );
};

export default PaymentSuccessPage;
