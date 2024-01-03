// PaymentSuccessPage.jsx
import { useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
      <h1>Payment Successful</h1>
      <p>Your payment was processed successfully.</p>
      <button onClick={() => navigate('/')}>Go Back to Store</button>
    </div>
  );
};

export default PaymentSuccessPage;
