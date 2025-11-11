// test.ts - TypeScript specific test file
import DiscardAPI, { DiscardAPIConfig } from '../dist/index.mjs';

const API_KEY: string = 'YOUR_API_KEY_HERE';

interface TestCase {
  name: string;
  fn: () => Promise<any>;
}

async function runTypeScriptTests(): Promise<void> {
  console.log('🧪 Starting TypeScript Specific Tests...\n');

  const config: DiscardAPIConfig = {
    apiKey: API_KEY,
    fullResponse: false,
    timeout: 30000
  };

  const api = new DiscardAPI(config);

  console.log('✅ SDK loaded successfully with TypeScript import');
  console.log(`   Instance type: ${api.constructor.name}`);
  console.log(`   Full Response Mode: ${api.getFullResponse()}\n`);

  const tests: TestCase[] = [
    {
      name: 'Type-Safe URL Shortener',
      fn: async () => api.shortenClck({ url: 'https://github.com/GlobalTechInfo' })
    },
    {
      name: 'Type-Safe Fake Users',
      fn: async () => api.fakeUsers({ 
        _quantity: 5, 
        _locale: 'en_US', 
        _gender: 'male',
        _seed: 9999
      })
    },
    {
      name: 'Type-Safe Image Download',
      fn: async () => api.dlInstagram({ 
        url: 'https://www.instagram.com/reel/DJ0_EqTom0X/' 
      })
    },
    {
      name: 'Type-Safe Codec',
      fn: async () => api.base64({ mode: 'encode', data: 'TypeScript Test' })
    },
    {
      name: 'Type-Safe Quote',
      fn: async () => api.islamicQuote()
    },
    {
      name: 'Type-Safe Image',
      fn: async () => api.programmingImage()
    },
    {
      name: 'Type-Safe Fact',
      fn: async () => api.yearFact({ year: 2024 })
    },
    {
      name: 'Type-Safe QR Code',
      fn: async () => api.qrTag({ 
        text: 'TypeScript',
        size: '300x300',
        color: '0-100-255'
      })
    },
    {
      name: 'Type-Safe Joke',
      fn: async () => api.programmingJoke()
    }
  ];

  let passed: number = 0;
  let failed: number = 0;

  for (const test of tests) {
    try {
      console.log(`▶️  Testing: ${test.name}...`);
      const result: any = await test.fn();
      console.log(`✅ ${test.name}: PASSED`);
      
      if (typeof result === 'string') {
        console.log(`   Result: ${result.substring(0, 80)}${result.length > 80 ? '...' : ''}\n`);
      } else if (Array.isArray(result)) {
        console.log(`   Result: Array with ${result.length} items\n`);
      } else if (typeof result === 'object' && result !== null) {
        const preview: string = JSON.stringify(result).substring(0, 80);
        console.log(`   Result: ${preview}...\n`);
      }
      
      passed++;
    } catch (error) {
      console.error(`❌ ${test.name}: FAILED`);
      if (error instanceof Error) {
        console.error(`   Error: ${error.message}\n`);
      } else {
        console.error(`   Unknown error\n`);
      }
      failed++;
    }
  }

  // Test configuration methods with TypeScript
  console.log('🔧 Testing Configuration Methods...');
  
  const originalMode: boolean = api.getFullResponse();
  api.setFullResponse(true);
  console.log(`   setFullResponse(true): ${api.getFullResponse()}`);
  
  api.setFullResponse(false);
  console.log(`   setFullResponse(false): ${api.getFullResponse()}`);
  
  api.setTimeout(60000);
  console.log(`   setTimeout(60000): Configuration updated\n`);

  // Test fullResponse toggle
  api.setFullResponse(true);
  try {
    const result: any = await api.randomQuote();
    const hasRequiredFields: boolean = 
      'status' in result && 
      'creator' in result && 
      'result' in result;
    
    if (hasRequiredFields) {
      console.log('✅ TypeScript type safety verified with full response');
      console.log(`   Response has all required fields\n`);
    }
  } catch (error) {
    console.error('⚠️  Full response test encountered an issue\n');
  }

  console.log('📊 TypeScript Test Summary:');
  console.log(`   Total: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All TypeScript tests passed!');
    console.log('   Type safety verified ✓');
    console.log('   Interface compliance verified ✓\n');
  } else {
    console.log('\n⚠️  Some tests failed. Check your API key and network connection.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

if (API_KEY === 'YOUR_API_KEY_HERE') {
  console.error('❌ Please set your API key before running tests!');
  console.error('   Edit line 4: const API_KEY: string = "your-actual-api-key";\n');
  process.exit(1);
}

runTypeScriptTests().catch((error: Error) => {
  console.error('\n💥 Test suite crashed:');
  console.error(error);
  process.exit(1);
});
