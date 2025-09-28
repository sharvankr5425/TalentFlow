import React from 'react';
import { Outlet } from 'react-router-dom';
import Layout from './Layout';

// This component acts as a wrapper for all pages inside the main application.
// It renders the main Layout (Header, Footer) and then the specific page content via <Outlet />.
export function AppShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
