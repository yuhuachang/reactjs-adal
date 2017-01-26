import AuthenticationContext from 'adal-angular';

const config = {
  instance: 'https://login.microsoftonline.com/',
  tenant: 'your tenant id',
  clientId: 'your client id',
  postLogoutRedirectUri: window.location.origin,
  cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
  endpoints: {
    graphApiUri: "https://graph.microsoft.com"
  }
};

export const authContext = new AuthenticationContext(config);

const isCallback = authContext.isCallback(window.location.hash);

authContext.handleWindowCallback();	

if (isCallback && !authContext.getLoginError()) {
  console.log('check login...');
  window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
}