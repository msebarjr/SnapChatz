import imageUrlBuilder from '@sanity/image-url';
import { myConfiguredSanityClient } from './sanity/sanityClient';

// This allows to quickly generate image urls from Sanity image records
const builder = imageUrlBuilder(myConfiguredSanityClient);

export function urlFor(source) {
  return builder.image(source);
}
