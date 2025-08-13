import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface WindowWithDeferredPrompt extends Window {
  deferredPrompt?: BeforeInstallPromptEvent;
  installPWA?: () => Promise<boolean>;
  isPWAInstallable?: () => boolean;
}

export function usePWAInstall() {
  const [, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar navegador
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
    const isBrave = userAgent.includes('Brave');
    const isFirefox = userAgent.includes('Firefox');
    const isEdge = userAgent.includes('Edg');
    
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Verificar si el navegador soporta PWA
    if (!('serviceWorker' in navigator)) {
      return;
    }

    // Escuchar eventos del script global
    const handlePWAInstallable = () => {
      setIsInstallable(true);
    };

    const handlePWAInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    // Verificar si ya es instalable usando la función global
    const windowWithPWA = window as WindowWithDeferredPrompt;
    if (windowWithPWA.isPWAInstallable?.()) {
      setIsInstallable(true);
    }

    // Lógica específica por navegador
    if (isFirefox) {
      // Firefox no soporta beforeinstallprompt, pero podemos detectar si es instalable
      // En Firefox, asumimos que es instalable si tiene manifest y service worker
      const hasManifest = document.querySelector('link[rel="manifest"]');
      if (hasManifest && 'serviceWorker' in navigator) {
        setIsInstallable(true);
      }
    } else if (isBrave) {
      // Brave puede necesitar más tiempo para detectar la instalabilidad
      // En Brave, esperamos un poco más para que se dispare el evento
      setTimeout(() => {
        if (windowWithPWA.isPWAInstallable?.()) {
          setIsInstallable(true);
        }
      }, 3000);
    }

    // Escuchar eventos personalizados del script global
    window.addEventListener('pwa-installable', handlePWAInstallable);
    window.addEventListener('pwa-installed', handlePWAInstalled);

    // También escuchar eventos nativos como respaldo
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handlePWAInstallable);
      window.removeEventListener('pwa-installed', handlePWAInstalled);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    try {
      // Usar la función global del script
      const windowWithPWA = window as WindowWithDeferredPrompt;
      const success = await windowWithPWA.installPWA?.();
      
      if (success) {
        setIsInstalled(true);
        setIsInstallable(false);
      }
    } catch (error) {
      console.error('Error al instalar la PWA:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPWA,
  };
}
