export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  home: `/${rootPaths.pageRoot}/home`,
  serviceProvidertCategory: `/${rootPaths.pageRoot}/service-provider-category`,
  serviceProviders: `/${rootPaths.pageRoot}/service-providers/:category`,
  serviceProvider: `/${rootPaths.pageRoot}/service-provider/:id`, // Dynamic parameter added

  tracking: `/${rootPaths.pageRoot}/tracking/:id`,
  location: `/${rootPaths.pageRoot}/location/:id`,

  profile: `/${rootPaths.pageRoot}/profile`,

  serviceRequests: `/${rootPaths.pageRoot}/service-requests`,
  serviceRequestsAccepted: `/${rootPaths.pageRoot}/service-requests-accepted`,
  serviceRequestsHistory: `/${rootPaths.pageRoot}/service-requests-history`,


  signin: `/${rootPaths.authRoot}/signin`,
  signup: `/${rootPaths.authRoot}/signup`,
  forgotPassword: `/${rootPaths.authRoot}/forgot-password`,
  404: `/${rootPaths.errorRoot}/404`,

  serviceProviderDashboard: `/${rootPaths.pageRoot}/sp/dashboard`,
  serviceProviderRequests: `/${rootPaths.pageRoot}/sp/service-requests`,
  serviceProviderRequestsDetails: `/${rootPaths.pageRoot}/sp/service-requests/:id`,
  services: `/${rootPaths.pageRoot}/sp/services`,


  serviceProviderHistory: `/${rootPaths.pageRoot}/sp/service-history`,
  serviceProviderEarnings: `/${rootPaths.pageRoot}/sp/earnings`,
  serviceProviderMaps: `/${rootPaths.pageRoot}/sp-maps`,
  spServiceRequestsAccepted: `/${rootPaths.pageRoot}/sp/service-requests-accepted`,


  chat: `/${rootPaths.pageRoot}/chat/:id`
  

};
