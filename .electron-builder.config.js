/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = async function () {
  const { getVersion } = await import('./version/getVersion.mjs');

  return {
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
    },
    asar: true,
    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'AppImage',
      publish: ['github'],
    },
    mac: {
      target: 'dmg',
      publish: ['github'],
      asar: false,
    },
    win: {
      target: 'nsis',
      publish: ['github'],
    },
  };
};
