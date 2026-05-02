import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

describe('Security Threat Response Workbench', () => {
  it('renders the surface-focused hero copy', () => {
    render(<App />);
    expect(screen.getByText('Security Threat Response Workbench')).toBeInTheDocument();
    expect(screen.getByText('Cloud Security Response Workbench')).toBeInTheDocument();
    expect(screen.getByText('Open operating map')).toBeInTheDocument();
    expect(screen.getByText('No extra resources required')).toBeInTheDocument();
    expect(screen.getByText('Python-normalized watchboard')).toBeInTheDocument();
  });

  it('switches scenarios and updates the overview', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getAllByRole('tab', { name: /Cloud Console Exploit Probe \/ East-West IDS Pivot/i })[0],
    );

    const decisionCard = screen.getByText('Operator decision').closest('.overview-card');

    expect(decisionCard).not.toBeNull();
    expect(
      within(decisionCard as HTMLElement).getByText(
        /Freeze risky change work, isolate the probed workload/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/Virtual patch recommendation pack/i)).toBeInTheDocument();
    expect(screen.getByText(/Built a cloud-console threat lane/i)).toBeInTheDocument();
  });

  it('filters the event queue and shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<App />);

    const queueSection = screen.getByText('Prioritized event triage').closest('section');

    expect(queueSection).not.toBeNull();

    await user.click(within(queueSection as HTMLElement).getByRole('button', { name: 'Critical' }));
    expect(within(queueSection as HTMLElement).getByText(/Showing 1 of 3 events/i)).toBeInTheDocument();

    await user.type(
      within(queueSection as HTMLElement).getByRole('searchbox', {
        name: /Filter security events/i,
      }),
      'no-hit',
    );
    expect(
      within(queueSection as HTMLElement).getByText(/No events match the current filter/i),
    ).toBeInTheDocument();
  });

  it('copies the operator brief', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<App />);

    const applicationSection = screen.getByText('Exportable operations notes').closest('section');

    expect(applicationSection).not.toBeNull();

    await user.click(
      within(applicationSection as HTMLElement).getByRole('button', {
        name: /Copy operator brief/i,
      }),
    );

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toContain('Portal Login Credential-Stuffing Surge');
    expect(
      within(applicationSection as HTMLElement).getByRole('button', {
        name: /Operator brief copied/i,
      }),
    ).toBeInTheDocument();
  });
});
