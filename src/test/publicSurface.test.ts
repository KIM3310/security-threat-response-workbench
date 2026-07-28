import { describe, expect, it } from 'vitest';
import docsOffer from '../../docs/service-offer.json';
import readmeText from '../../README.md?raw';
import indexHtml from '../../index.html?raw';
import revenueText from '../../docs/revenue-architecture.md?raw';
import searchGrowthText from '../../docs/search-growth-implementation.md?raw';
import publicLlmsText from '../../public/llms.txt?raw';
import publicOffer from '../../public/service-offer.json';

const incidentInquiryUrl =
  'https://kim3310-doeon-kim-portfolio.pages.dev/?offer=security-threat-response-workbench&inquiry=incident-operations-exercise#private-inquiry';

describe('public commercial surface', () => {
  it('keeps service offer files on the incident operations exercise lane', () => {
    for (const offer of [docsOffer, publicOffer]) {
      expect(offer.lead_capture_url).toBe(incidentInquiryUrl);
      expect(offer.commerce.lane_id).toBe('incident-operations-exercise');
      expect(offer.commerce.lane_name).toBe('Incident Operations Exercise');
      expect(offer.commerce.checkout.fallback_url).toBe(incidentInquiryUrl);
      expect(offer.first_paid_sku).toBe('Incident Operations Exercise facilitated exercise from USD 1,800');
      expect(offer.structured_data.offers[1].url).toBe(incidentInquiryUrl);
    }
  });

  it('keeps README and search docs aligned with private inquiry capture', () => {
    const combined = [readmeText, revenueText, searchGrowthText, publicLlmsText].join('\n');

    expect(combined).toContain(incidentInquiryUrl);
    expect(combined).not.toContain('GitHub Issue Form');
    expect(combined).not.toContain('GitHub issue form');
    expect(combined).not.toContain('issues/new');
    expect(combined).not.toContain('request private workspace');
    expect(combined).toContain('Incident Operations Exercise');
    expect(revenueText).toContain('central private inquiry URL');
  });

  it('publishes JSON-LD with honest paid exercise positioning', () => {
    expect(indexHtml).toContain('synthetic incident-operations exercise demo');
    expect(indexHtml).toContain('Incident Operations Exercise');
    expect(indexHtml).toContain(incidentInquiryUrl);
  });
});
