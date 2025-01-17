import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardHeader from '@/components/DashboardHeader';
import { getVersion } from '@/services/utils';

describe('DashboardHeader', () => {
  vi.mock('@/services/utils', () => {
    return {
      getVersion: vi.fn().mockReturnValue('3.1.0')
    };
  });

  afterEach(vi.clearAllMocks);

  it.each([
    ['Workflow Jobs'], ['Exposed Secrets'], ['Code Standard Violations']
  ])('should render dashboard header for %s', (subHeader) => {
    expect(mount(DashboardHeader, {
      props: {
        subHeader
      }
    }).html()).toMatchSnapshot();
    expect(getVersion).toBeCalledTimes(1);
  });
});
