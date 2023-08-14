import * as React from 'react';
import TopNavigation from '@cloudscape-design/components/top-navigation';

const Header = () => {
  return (
    <TopNavigation
      identity={{
        href: '/',
        title: 'AWS CDK Translator',
      }}
      utilities={[
        {
          type: 'button',
          text: 'GitHub',
          href: 'https://example.com/',
          //   iconName: 'file',
          external: true,
          externalIconAriaLabel: ' (opens in a new tab)',
        },
        {
          type: 'menu-dropdown',
          text: 'Menu',
          //   description: 'email@example.com',
          //   iconName: 'user-profile',
          items: [
            {
              id: 'feedback',
              text: 'Feedback',
              href: 'https://example.com/',
              //   iconName: 'envelope',
              external: true,
              externalIconAriaLabel: ' (opens in new tab)',
            },
            {
              id: 'disclaimer',
              text: 'Disclaimer',
              href: 'https://example.com/',
              external: true,
              externalIconAriaLabel: ' (opens in new tab)',
            },
          ],
        },
      ]}
    />
  );
};

export default Header;
