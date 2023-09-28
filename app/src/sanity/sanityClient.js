import { createClient } from '@sanity/client';

export const myConfiguredSanityClient = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2023-09-20', // Targets latest API version by using the current date
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});
