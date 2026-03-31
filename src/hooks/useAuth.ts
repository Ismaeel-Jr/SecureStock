import { useEffect, useState } from 'react';
import { Profile } from '../types';
import { MOCK_PROFILE } from '../lib/mockData';

export function useAuth() {
  // Always return the mock profile for demo mode without login
  const profile = MOCK_PROFILE;
  const user = { id: MOCK_PROFILE.id, email: MOCK_PROFILE.email };
  const loading = false;

  const login = (email: string) => {
    console.log('Login called in bypass mode:', email);
  };

  const logout = () => {
    console.log('Logout called in bypass mode');
  };

  return { user, profile, loading, isAdmin: true, login, logout };
}
