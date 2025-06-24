// lib/pwa-utils.ts
import { DeviceInfo, PWAInstallInfo } from '@/types/pwa'

export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isDesktop: true,
      isAndroid: false,
      isIOS: false,
      isChrome: false,
      isSafari: false,
      isFirefox: false,
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()
  const standalone = window.matchMedia('(display-mode: standalone)').matches
  const isInWebAppiOS = (window.navigator as any).standalone === true
  
  return {
    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    isDesktop: !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    isAndroid: /android/i.test(userAgent),
    isIOS: /iphone|ipad|ipod/i.test(userAgent),
    isChrome: /chrome/i.test(userAgent) && !/edg/i.test(userAgent),
    isSafari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
    isFirefox: /firefox/i.test(userAgent),
  }
}

export function detectPWAInstallation(): PWAInstallInfo {
  if (typeof window === 'undefined') {
    return {
      isInstalled: false,
      isInstallable: false,
      showInstallPrompt: false,
    }
  }

  // Verificar se está rodando em modo standalone (instalado)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
  const isInWebAppiOS = (window.navigator as any).standalone === true
  const isInstalled = isStandalone || isInWebAppiOS

  return {
    isInstalled,
    isInstallable: !isInstalled,
    showInstallPrompt: !isInstalled,
  }
}

export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator
}

export async function registerServiceWorker(): Promise<void> {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker não é suportado neste navegador')
    return
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })
    
    console.log('Service Worker registrado com sucesso:', registration)
    
    // Verificar atualizações
    registration.addEventListener('updatefound', () => {
      console.log('Nova versão do Service Worker encontrada')
    })
  } catch (error) {
    console.error('Erro ao registrar Service Worker:', error)
  }
}