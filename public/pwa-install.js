// Script para capturar el evento beforeinstallprompt
let deferredPrompt;

// Función para verificar si la PWA cumple los criterios básicos
function checkPWACriteria() {
  const hasManifest = document.querySelector('link[rel="manifest"]');
  const hasServiceWorker = 'serviceWorker' in navigator;
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  
  // Detectar navegador
  const userAgent = navigator.userAgent;
  const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
  const isBrave = userAgent.includes('Brave');
  const isFirefox = userAgent.includes('Firefox');
  const isEdge = userAgent.includes('Edg');
  
  console.log('PWA Criteria Check:', {
    hasManifest: !!hasManifest,
    hasServiceWorker,
    isSecure,
    hostname: window.location.hostname,
    browser: {
      isChrome,
      isBrave,
      isFirefox,
      isEdge
    }
  });
  
  return hasManifest && hasServiceWorker && isSecure;
}

// Verificar criterios al cargar
if (checkPWACriteria()) {
  console.log('PWA Install Script: Criterios básicos cumplidos');
  
  // Para Firefox, notificar que es potencialmente instalable
  if (navigator.userAgent.includes('Firefox')) {
    console.log('PWA Install Script: Firefox detectado - marcando como potencialmente instalable');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
    }, 1000);
  }
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('PWA Install Script: beforeinstallprompt capturado');
  // Prevenir que Chrome muestre automáticamente el prompt
  e.preventDefault();
  // Guardar el evento para usarlo después
  deferredPrompt = e;
  // Notificar a la aplicación que la PWA es instalable
  window.dispatchEvent(new CustomEvent('pwa-installable', { detail: true }));
});

window.addEventListener('appinstalled', (evt) => {
  console.log('PWA Install Script: App instalada');
  // Limpiar el prompt guardado
  deferredPrompt = null;
  // Notificar a la aplicación que la PWA fue instalada
  window.dispatchEvent(new CustomEvent('pwa-installed', { detail: true }));
});

// Función global para instalar la PWA
window.installPWA = async () => {
  if (!deferredPrompt) {
    console.log('PWA Install Script: No hay prompt disponible');
    return false;
  }

  try {
    console.log('PWA Install Script: Mostrando prompt de instalación');
    // Mostrar el prompt de instalación
    deferredPrompt.prompt();
    
    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA Install Script: Usuario aceptó la instalación');
      deferredPrompt = null;
      return true;
    } else {
      console.log('PWA Install Script: Usuario rechazó la instalación');
      return false;
    }
  } catch (error) {
    console.error('PWA Install Script: Error al instalar', error);
    return false;
  }
};

// Función para verificar si la PWA es instalable
window.isPWAInstallable = () => {
  return !!deferredPrompt;
};
