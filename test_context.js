const { ContextManager } = require('./dist/context-manager/ContextManager');
const path = require('path');

const mgr = new ContextManager();
const cxfDir = path.join(__dirname, '.cxf');
const prompt = mgr.getOptimizedContext('I want to fix the auth logic', 5000, cxfDir);
console.log('Prompt Generated length:', prompt.length);
