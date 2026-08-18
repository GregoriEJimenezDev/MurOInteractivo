import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, RefreshCw } from 'lucide-react';
import { authService } from '../../config/services.js';
import { hasConfig } from '../../config/firebase.js';

/**
 * Verify Email Page Component (View).
 * Shown after registration. Instructs the user to check their email
 * and click the verification link. In Mock mode, provides a button
 * to simulate clicking the link.
 */
export default function VerifyEmail({ email, onNavigate }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [resendMsg, setResendMsg] = useState('');

  // In mock mode, try to get the verification token automatically
  const isMock = !hasConfig;
  const [mockToken, setMockToken] = useState(null);

  useEffect(() => {
    if (isMock && email) {
      // Get the mock verification token for this email
      const token = authService.getPendingVerificationToken?.(email);
      setMockToken(token);
    }
  }, [isMock, email]);

  const handleVerifyClick = async () => {
    if (!mockToken) return;

    setIsVerifying(true);
    setError(null);
    try {
      await authService.verifyEmail(mockToken);
      setVerified(true);
    } catch (err) {
      setError(err?.message || 'Error al verificar el correo.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    setResendMsg('');
    try {
      await authService.sendVerificationEmail();
      setResendMsg('Correo de verificación reenviado. Revisa tu bandeja de entrada.');
    } catch (err) {
      setError(err?.message || 'No se pudo reenviar el correo.');
    } finally {
      setIsResending(false);
    }
  };

  if (verified) {
    return (
      <div className="page auth-page">
        <div className="auth-card glass-card text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="auth-title">¡Correo verificado!</h2>
          <p className="auth-subtitle">
            Tu cuenta ha sido confirmada exitosamente. Ya puedes iniciar sesión.
          </p>
          <button
            className="btn btn-primary btn-block mt-6"
            onClick={() => onNavigate('login')}
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page auth-page">
      <div className="auth-card glass-card text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-100">
          <Mail size={32} className="text-blue-600" />
        </div>

        <h2 className="auth-title">Verifica tu correo electrónico</h2>

        <p className="auth-subtitle">
          Enviamos un correo de verificación a:
        </p>
        <p className="mt-2 text-sm font-bold text-gray-800">
          {email || 'tu correo electrónico'}
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Haz clic en el enlace del correo para activar tu cuenta.
          Luego podrás iniciar sesión.
        </p>

        {error && (
          <div className="form-alert error mt-4" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        {resendMsg && (
          <div className="form-alert success mt-4">
            <span>✅</span> {resendMsg}
          </div>
        )}

        {/* Mock mode: simulate clicking the verification link */}
        {isMock && mockToken && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
              Modo desarrollo
            </p>
            <p className="text-sm text-amber-700 mb-3">
              Como estás en modo local, haz clic aquí para simular que abriste el enlace del correo:
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={handleVerifyClick}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Verificando...
                </>
              ) : (
                'Simular verificación de correo'
              )}
            </button>
          </div>
        )}

        {/* Firebase mode: resend email button */}
        {!isMock && (
          <div className="mt-6">
            <p className="text-xs text-gray-400 mb-3">
              ¿No recibiste el correo? Revisa tu carpeta de spam o reenvía el correo:
            </p>
            <button
              className="btn btn-secondary btn-block"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Reenviar correo de verificación
                </>
              )}
            </button>
          </div>
        )}

        <p className="auth-footer text-center mt-6">
          ¿Ya verificaste tu correo?{' '}
          <span className="auth-link" onClick={() => onNavigate('login')}>
            Iniciar Sesión
          </span>
        </p>
      </div>
    </div>
  );
}
