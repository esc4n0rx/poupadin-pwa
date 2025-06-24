// types/pwa.ts
export interface DeviceInfo {
  isMobile: boolean
  isDesktop: boolean
  isAndroid: boolean
  isIOS: boolean
  isChrome: boolean
  isSafari: boolean
  isFirefox: boolean
}

export interface PWAInstallInfo {
  isInstalled: boolean
  isInstallable: boolean
  showInstallPrompt: boolean
}

export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type AccessModalStep = 'checking' | 'desktop-blocked' | 'android-install' | 'ios-install' | 'allowed'