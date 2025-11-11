// test.mjs - ES Module specific test file
import DiscardAPI from '../dist/index.mjs';

const API_KEY = 'YOUR_API_KEY_HERE';

async function runESMTests() {
  console.log('🧪 Starting ES Module Specific Tests...\n');

  const api = new DiscardAPI({ 
    apiKey: API_KEY,
    fullResponse: false 
  });

  console.log('✅ SDK loaded successfully with ES Module import');
  console.log(`   Instance type: ${api.constructor.name}\n`);

  const tests = [
    {
      name: 'Islamic - Quran Surah',
      fn: () => api.quranSurah({ surah: 'yaseen' })
    },
    {
      name: 'Download - TikTok',
      fn: () => api.dlTikTok({ url: 'https://vm.tiktok.com/ZSBKon146' })
    },
    {
      name: 'URL Shortener - Tiny',
      fn: () => api.shortenTiny({ url: 'https://nodejs.org' })
    },
    {
      name: 'Joke - Dad Joke',
      fn: () => api.dadJoke()
    },
    {
      name: 'Quote - Motivational',
      fn: () => api.motivQuote()
    },
    {
      name: 'Image - Dog',
      fn: () => api.dogImage()
    },
    {
      name: 'Faker - Fake Addresses',
      fn: () => api.fakeAddresses({ _quantity: 2, _locale: 'en_US' })
    },
    {
      name: 'Fact - Math Fact',
      fn: () => api.mathFact({ number: 42 })
    },
    {
      name: 'Codec - Binary Encode',
      fn: () => api.binary({ mode: 'encode', data: 'ESM' })
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

  // Test fullResponse mode
  console.log('🔄 Testing fullResponse mode...');
  api.setFullResponse(true);
  try {
    const result = await api.randomQuote();
    const hasAllFields = result.status !== undefined && 
                         result.creator !== undefined && 
                         result.result !== undefined;
    
    if (hasAllFields) {
      console.log('✅ Full response mode works correctly');
      console.log(`   Status: ${result.status}, Creator: ${result.creator !== undefined}\n`);
    } else {
      console.log('⚠️  Full response mode missing some fields\n');
    }
  } catch (error) {
    console.error('❌ Full response test failed:', error.message, '\n');
  }

  console.log('📊 ES Module Test Summary:');
  console.log(`   Total: ${tests.length}`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All ES Module tests passed!\n');
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

runESMTests().catch(error => {
  console.error('\n💥 Test suite crashed:');
  console.error(error);
  process.exit(1);
});
