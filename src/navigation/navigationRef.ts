import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToMain() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('MainTabs');
  }
}

export function navigateToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Login');
  }
}
