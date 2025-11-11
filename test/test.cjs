// test.cjs - CommonJS specific test file
const DiscardAPI = require('../dist/index.cjs');

const API_KEY = 'YOUR_API_KEY_HERE';

async function runCJSTests() {
  console.log('🧪 Starting CommonJS Specific Tests...\n');

  const api = new DiscardAPI({ 
    apiKey: API_KEY,
    fullResponse: false 
  });

  console.log('✅ SDK loaded successfully with CommonJS require()');
  console.log(`   Instance type: ${api.constructor.name}\n`);

  const tests = [
    {
      name: 'Neo Article',
      fn: () => api.NeoArticle({ url: 'https://www.neonews.pk/06-Oct-2025/176006' })
    },
    {
      name: 'Simple Counter',
      fn: () => api.toolsCounter({ count: 100 })
    },
    {
      name: 'Unit Converter',
      fn: () => api.toolsUnitConvert({ from: 'c', to: 'f', value: 20 })
    },
    {
      name: 'Bank Logo',
      fn: () => api.toolsBanklogo({ domain: 'meezanbank.com' })
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`▶️  Testing: ${test.name}...`);
      const result = await test.fn();
      console.log(`✅ ${test.name}: PASSED`);
      
      if (typeof result === 'string') {
        console.log(`   Result: ${result.substring(0, 80)}${result.length > 80 ? '...' : ''}\n`);
      } else if (Array.isArray(result)) {
        console.log(`   Result: Array with ${result.length} items\n`);
      } else if (typeof result === 'object') {
        console.log(`   Result: ${JSON.stringify(result).substring(0, 80)}...\n`);
      }
      
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name}: FAILED`);
      console.error(`   Error: ${error.message}\n`);
      failed++;
    }
  }

  console.log('📊 CommonJS Test Summary:');
  console.log(`   Total: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All CommonJS tests passed!\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check your API key and network connection.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

if (API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('❌ Please set your API key before running tests!');
  console.error('   Edit line 4: const API_KEY = "your-actual-api-key";\n');
  process.exit(1);
}

runCJSTests().catch(error => {
  console.error('\n💥 Test suite crashed:');
  console.error(error);
  process.exit(1);
});
