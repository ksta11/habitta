// jest.polyfills.js
// Este archivo se ejecuta ANTES del preset de jest-expo
// para prevenir que el runtime Winter cause problemas

// Mock __ExpoImportMetaRegistry antes de que se cargue cualquier cosa
global.__ExpoImportMetaRegistry = {};

// Mock TextEncoder/TextDecoder para jsdom
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}
if (typeof TextEncoderStream === 'undefined') {
  global.TextEncoderStream = class TextEncoderStream {};
}
if (typeof TextDecoderStream === 'undefined') {
  global.TextDecoderStream = class TextDecoderStream {};
}
if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Deshabilitar Expo Winter runtime durante las pruebas
process.env.EXPO_USE_WINTER = 'false';
process.env.EXPO_SKIP_WINTER = 'true';
