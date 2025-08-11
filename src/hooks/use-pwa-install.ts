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
    console.log('PWA Install Hook: Inicializando...');
    
    // Detectar navegador
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
    const isBrave = userAgent.includes('Brave');
    const isFirefox = userAgent.includes('Firefox');
    const isEdge = userAgent.includes('Edg');
    
    console.log('PWA Install Hook: Navegador detectado:', {
      isChrome,
      isBrave,
      isFirefox,
      isEdge,
      userAgent: userAgent.substring(0, 100) + '...'
    });
    
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWA Install Hook: Ya está instalada');
      setIsInstalled(true);
      return;
    }

    // Verificar si el navegador soporta PWA
    if (!('serviceWorker' in navigator)) {
      console.log('PWA Install Hook: Service Worker no soportado');
      return;
    }

    // Escuchar eventos del script global
    const handlePWAInstallable = () => {
      console.log('PWA Install Hook: PWA marcada como instalable');
      setIsInstallable(true);
    };

    const handlePWAInstalled = () => {
      console.log('PWA Install Hook: PWA instalada');
      setIsInstalled(true);
      setIsInstallable(false);
    };

    // Verificar si ya es instalable usando la función global
    const windowWithPWA = window as WindowWithDeferredPrompt;
    if (windowWithPWA.isPWAInstallable?.()) {
      console.log('PWA Install Hook: Ya es instalable según script global');
      setIsInstallable(true);
    }

    // Lógica específica por navegador
    if (isFirefox) {
      // Firefox no soporta beforeinstallprompt, pero podemos detectar si es instalable
      console.log('PWA Install Hook: Firefox detectado - usando método alternativo');
      // En Firefox, asumimos que es instalable si tiene manifest y service worker
      const hasManifest = document.querySelector('link[rel="manifest"]');
      if (hasManifest && 'serviceWorker' in navigator) {
        console.log('PWA Install Hook: Firefox - PWA potencialmente instalable');
        setIsInstallable(true);
      }
    } else if (isBrave) {
      // Brave puede necesitar más tiempo para detectar la instalabilidad
      console.log('PWA Install Hook: Brave detectado - esperando evento...');
      // En Brave, esperamos un poco más para que se dispare el evento
      setTimeout(() => {
        if (windowWithPWA.isPWAInstallable?.()) {
          console.log('PWA Install Hook: Brave - PWA instalable detectada');
          setIsInstallable(true);
        }
      }, 3000);
    }

    // Escuchar eventos personalizados del script global
    window.addEventListener('pwa-installable', handlePWAInstallable);
    window.addEventListener('pwa-installed', handlePWAInstalled);

    // También escuchar eventos nativos como respaldo
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Install Hook: beforeinstallprompt detectado');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA Install Hook: App instalada');
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
        console.log('PWA instalada exitosamente');
        setIsInstalled(true);
        setIsInstallable(false);
      } else {
        console.log('Instalación cancelada o falló');
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
