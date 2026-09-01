import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Phone, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, sendOtp, verifyOtp } = useAuth();

  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devHint, setDevHint] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  const otpInputsRef = useRef([]);

  // Reset state on open/close
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('phone');
      setPhone('');
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMessage('');
      setDevHint('');
      setResendTimer(30);
    }
  }, [isAuthModalOpen]);

  // Handle Resend Countdown
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isAuthModalOpen) return null;

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(clean);
      if (res.devOtp) {
        setDevHint(res.devOtp);
      }
      setStep('otp');
      setResendTimer(30);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      if (pasted.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = pasted[i] || '';
        }
        setOtpDigits(newDigits);
        if (pasted.length === 6) {
          triggerVerify(phone, pasted);
        } else {
          otpInputsRef.current[Math.min(pasted.length, 5)]?.focus();
        }
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) {
      triggerVerify(phone, fullOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const triggerVerify = async (cleanPhone, fullOtp) => {
    setErrorMessage('');
    setLoading(true);
    try {
      await verifyOtp(cleanPhone, fullOtp);
    } catch (err) {
      setErrorMessage(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualVerify = (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }
    triggerVerify(phone, fullOtp);
  };

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.devOtp) setDevHint(res.devOtp);
      setResendTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 13, 20, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) closeAuthModal();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #181C26 0%, #10131B 100%)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.75)',
          padding: '28px 24px',
          position: 'relative',
          color: '#F9FAFB',
          fontFamily: 'var(--font-sans, sans-serif)'
        }}
      >
        {/* Close Button */}
        {!loading && (
          <button
            onClick={closeAuthModal}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#9CA3AF',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-block',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#F3E5AB',
              background: 'rgba(212, 175, 55, 0.12)',
              border: '1px solid rgba(212, 175, 55, 0.25)',
              padding: '4px 12px',
              borderRadius: '20px',
              marginBottom: '10px'
            }}
          >
            ✦ Collector Portal ✦
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif, Georgia, serif)',
              fontSize: '1.5rem',
              color: '#FFFFFF',
              margin: '0 0 6px 0',
              fontWeight: '700'
            }}
          >
            {step === 'phone' ? 'Sign In to Viyona' : 'Verify Your WhatsApp'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', margin: 0, lineHeight: 1.4 }}>
            {step === 'phone'
              ? 'Enter your mobile number to access saved addresses and live courier tracking.'
              : `We sent a 6-digit code via WhatsApp to +91 ${phone}`}
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.82rem',
              color: '#FCA5A5',
              marginBottom: '16px'
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        {devHint && (
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              color: '#6EE7B7',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <CheckCircle2 style={{ width: '15px', height: '15px', color: '#10B981' }} />
            <span>Test OTP Code: <strong>{devHint}</strong></span>
          </div>
        )}

        {step === 'phone' ? (
          /* Step 1: Phone Entry */
          <form onSubmit={handlePhoneSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '600', color: '#D1D5DB', marginBottom: '6px' }}>
                Mobile Phone Number *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0D1017',
                    color: '#F3E5AB',
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  autoFocus
                  required
                  placeholder="10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  style={{
                    flex: 1,
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0D1017',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    letterSpacing: '0.05em',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.replace(/\D/g, '').length !== 10}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: '700',
                cursor: loading || phone.replace(/\D/g, '').length !== 10 ? 'not-allowed' : 'pointer',
                opacity: loading || phone.replace(/\D/g, '').length !== 10 ? 0.6 : 1,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '6px'
              }}
            >
              <span>{loading ? 'Sending Code...' : 'Send WhatsApp Verification Code'}</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Entry */
          <form onSubmit={handleManualVerify} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpInputsRef.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '46px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '1.4rem',
                    fontWeight: '800',
                    borderRadius: '10px',
                    border: digit ? '1.5px solid #F3E5AB' : '1px solid rgba(255, 255, 255, 0.18)',
                    background: '#0D1017',
                    color: '#FFFFFF',
                    outline: 'none',
                    boxShadow: digit ? '0 0 12px rgba(212, 175, 55, 0.25)' : 'none'
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otpDigits.join('').length !== 6}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                background: 'linear-gradient(135deg, #0C2340 0%, #1A365D 100%)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: '700',
                cursor: loading || otpDigits.join('').length !== 6 ? 'not-allowed' : 'pointer',
                opacity: loading || otpDigits.join('').length !== 6 ? 0.6 : 1,
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{loading ? 'Verifying...' : 'Verify & Enter Portal'}</span>
              <CheckCircle2 style={{ width: '18px', height: '18px', color: '#F3E5AB' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#9CA3AF' }}>
              <button
                type="button"
                onClick={() => setStep('phone')}
                style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
              >
                Change Phone Number
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendTimer > 0 ? '#6B7280' : '#F3E5AB',
                  cursor: resendTimer > 0 ? 'default' : 'pointer',
                  fontWeight: '600',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <RotateCw style={{ width: '12px', height: '12px' }} />
                <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Security Trust Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.74rem',
            color: '#9CA3AF'
          }}
        >
          <ShieldCheck style={{ width: '15px', height: '15px', color: '#10B981' }} />
          <span>🔒 Passwordless 1-Click Verification • 100% Encrypted</span>
        </div>
      </div>
    </div>
  );
}
