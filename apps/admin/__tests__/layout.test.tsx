import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminSidebar } from '../src/components/layout/admin-sidebar';

describe('AdminSidebar Component', () => {
  it('renders all operational sidebar navigation sections', () => {
    render(<AdminSidebar />);

    expect(screen.getByText('OmniPost Admin')).toBeTruthy();
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Users')).toBeTruthy();
    expect(screen.getByText('Workspaces')).toBeTruthy();
    expect(screen.getByText('Publishing Queue')).toBeTruthy();
    expect(screen.getByText('Platforms Health')).toBeTruthy();
  });
});
