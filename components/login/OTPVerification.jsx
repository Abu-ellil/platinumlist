import { useState, useEffect } from 'react';

const OTPVerification = ({ email, onVerified, onCancel }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp
        }),
      });

      const data = await response.json();

      if (data.success) {
        onVerified();
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('حدث خطأ أثناء التحقق من الرمز');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setCountdown(60);
        setCanResend(false);
        setOtp('');
        // Show success message briefly
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('فشل في إعادة إرسال الرمز');
    } finally {
      setResending(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="otp-modal" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        direction: 'rtl'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#667eea',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#333', marginBottom: '10px' }}>
            تحقق من بريدك الإلكتروني
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            أدخل رمز التحقق المرسل إلى
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>
            {email}
          </p>
        </div>

        <form onSubmit={handleVerifyOTP}>
          <div style={{ marginBottom: '25px' }}>
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="أدخل رمز التحقق"
              maxLength="6"
              style={{
                width: '100%',
                padding: '15px 20px',
                fontSize: '24px',
                textAlign: 'center',
                border: '2px solid #e1e5e9',
                borderRadius: '8px',
                letterSpacing: '8px',
                fontWeight: 'bold',
                backgroundColor: '#f8f9fa'
              }}
              autoFocus
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fee',
              color: '#c53030',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: loading || otp.length !== 6 ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {loading ? 'جاري التحقق...' : 'تحقق من الرمز'}
          </button>
        </form>

        <div style={{ marginBottom: '20px' }}>
          {canResend ? (
            <button
              onClick={handleResendOTP}
              disabled={resending}
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                textDecoration: 'underline',
                cursor: resending ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {resending ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
            </button>
          ) : (
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              يمكنك إعادة الإرسال خلال {countdown} ثانية
            </p>
          )}
        </div>

        <button
          onClick={onCancel}
          style={{
            background: 'none',
            border: '1px solid #ddd',
            color: '#666',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default OTPVerification; 