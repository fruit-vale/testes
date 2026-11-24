const { defineConfig } = require('cypress');

// Ambiente: dev (padrão), stg ou prod  ->  npx cypress run --env ambiente=stg
const ambientes = {
  dev:  { baseUrl: 'https://fruitvale.com.br', apiUrl: 'https://api.fruitvale.com.br' },
  stg:  { baseUrl: 'https://fruitvale.com.br', apiUrl: 'https://api.fruitvale.com.br' },
  prod: { baseUrl: 'https://fruitvale.com.br', apiUrl: 'https://api.fruitvale.com.br' },
};

module.exports = defineConfig({
  // Relatório HTML
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'FruitVale - Relatório de Testes',
    charts: true,
    embeddedScreenshots: true, // prints das falhas dentro do HTML
    inlineAssets: true,        // gera um único arquivo .html
    saveAllAttempts: false,
  },

  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

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