import CMS from 'netlify-cms-app';

if (typeof window !== 'undefined') {
  window['CMS'] = CMS;
}
