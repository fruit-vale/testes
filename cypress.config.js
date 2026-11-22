const { defineConfig } = require('cypress');

// Ambiente: dev (padrão), stg ou prod  ->  npx cypress run --env ambiente=stg
const ambientes = {
  dev:  { baseUrl: 'https://fruitvale.com.br/',          apiUrl: 'https://fruitvale.com.br/' },
  stg:  { baseUrl: 'https://fruitvale.com.br/',  apiUrl: 'https://fruitvale.com.br/' },
  prod: { baseUrl: 'https://fruitvale.com.br',      apiUrl: 'https://fruitvale.com.br/' },
};

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      const amb = ambientes[config.env.ambiente || 'dev'];
      config.baseUrl = amb.baseUrl;
      config.env.apiUrl = amb.apiUrl;
      return config;
    },
  },
  viewportWidth: 1366,
  viewportHeight: 768,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
});
