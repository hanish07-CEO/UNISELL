/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, DashboardScreen, UserProfile } from './types';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { DashboardPage } from './components/DashboardPage';
import { OfflinePage } from './components/OfflinePage';
import { EngagementEffects } from './components/EngagementEffects';

const DEFAULT_USER: UserProfile = {
  name: 'Rahul Mehta',
  email: 'rahul@mehtaethnic.in',
  businessName: 'Mehta Ethnic House',
  plan: 'Pragati Plan',
  emailVerified: true,
};

export default function App() {
  const [page, setPage] = useState<PageView>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' || params.get('page') === 'dashboard') {
      return 'dashboard';
    }
    if (params.get('page') === 'login' || params.get('new') === 'true') {
      return 'login';
    }
    if (params.get('page') === 'offline') {
      return 'offline';
    }
    return 'landing';
  });

  const [authTab, setAuthTab] = useState<'si' | 'reg'>('si');
  const [dashboardScreen, setDashboardScreen] = useState<DashboardScreen>('overview');

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('unisell_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('unisell_user', JSON.stringify(user));
    } catch {
      // ignore storage errors
    }
  }, [user]);

  const handleNavigate = (
    nextPage: PageView,
    options?: { tab?: 'si' | 'reg'; screen?: DashboardScreen }
  ) => {
    if (options?.tab) {
      setAuthTab(options.tab);
    }
    if (options?.screen) {
      setDashboardScreen(options.screen);
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <EngagementEffects enableGravityButton={page === 'landing'} />

      {page === 'landing' && <LandingPage onNavigate={handleNavigate} />}

      {page === 'login' && (
        <AuthPage
          initialTab={authTab}
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {page === 'dashboard' && (
        <DashboardPage
          initialScreen={dashboardScreen}
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {page === 'offline' && <OfflinePage onNavigate={handleNavigate} />}
    </>
  );
}
