// Configuração do Karma. Localmente abre o Chrome; no CI use --browsers=ChromeHeadlessCI.
const path = require('node:path');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
    ],
    client: {
      jasmine: { random: true },
      clearContext: false,
    },
    jasmineHtmlReporter: { suppressAll: true },
    coverageReporter: {
      dir: path.join(__dirname, 'reports/coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'cobertura' }],
      check: {
        global: { statements: 80, lines: 80, branches: 70, functions: 75 },
      },
    },
    junitReporter: {
      outputDir: path.join(__dirname, 'reports'),
      outputFile: 'junit.xml',
      useBrowserName: false,
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      // Containers de CI rodam como root e com /dev/shm pequeno.
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-dev-shm-usage'],
      },
    },
    restartOnFileChange: true,
  });
};
