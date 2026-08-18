import React from 'react';
import { ArrowLeft, CircleHelp, KeyRound, MessageCircleQuestion, ShieldCheck } from 'lucide-react';

export default function Help({ onNavigate }) {
  return (
    <section className="mx-auto max-w-3xl">
      <button onClick={() => onNavigate('home')} className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-gray-500 transition-colors hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-50">
        <ArrowLeft size={16} /> Volver al muro
      </button>
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-9">
        <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600"><CircleHelp size={22} /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Centro de ayuda</p><h1 className="mt-1 text-3xl font-extrabold tracking-[-0.05em] text-gray-900">¿Cómo podemos ayudarte?</h1><p className="mt-3 text-sm leading-6 text-gray-600">Encuentra respuestas rápidas para empezar a usar Muro Interactivo.</p></div></div>
        <div className="mt-8 divide-y divide-gray-100">
          <div className="flex gap-4 py-5"><KeyRound className="mt-1 shrink-0 text-gray-400" size={19} /><div><h2 className="font-bold text-gray-900">No puedo iniciar sesión</h2><p className="mt-1 text-sm leading-6 text-gray-600">Comprueba que el usuario esté escrito igual que durante el registro y que la contraseña tenga al menos seis caracteres.</p></div></div>
          <div className="flex gap-4 py-5"><ShieldCheck className="mt-1 shrink-0 text-gray-400" size={19} /><div><h2 className="font-bold text-gray-900">¿Mis datos están protegidos?</h2><p className="mt-1 text-sm leading-6 text-gray-600">La sesión se valida mediante Firebase cuando está configurado. Nunca compartas tu contraseña ni la publiques en el muro.</p></div></div>
          <div className="flex gap-4 py-5"><MessageCircleQuestion className="mt-1 shrink-0 text-gray-400" size={19} /><div><h2 className="font-bold text-gray-900">¿Necesitas más ayuda?</h2><p className="mt-1 text-sm leading-6 text-gray-600">Revisa que el servicio backend esté disponible y vuelve a intentarlo. Si el problema continúa, contacta con el administrador.</p></div></div>
        </div>
        <button onClick={() => onNavigate('home')} className="mt-4 rounded-xl bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800 active:scale-95">Volver al inicio</button>
      </div>
    </section>
  );
}
