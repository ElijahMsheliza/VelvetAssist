/* eslint-disable @typescript-eslint/no-require-imports */
const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testAI() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  console.log("Fetching a valid profile ID...");
  const { data: config, error: configError } = await supabase
    .from('assistant_config')
    .select('profile_id')
    .limit(1)
    .single();

  if (configError || !config) {
    console.error("No valid assistant config found in DB. Test cannot proceed unless a user is configured.");
    return;
  }

  const profileId = config.profile_id;
  console.log(`Testing AI Route with Profile ID: ${profileId}`);

  try {
    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profileId,
        messages: [{ role: 'user', content: 'Hi! Are you taking bookings?' }]
      })
    });

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(text);
      return;
    }

    console.log("Streaming response from AI:");
    for await (const chunk of res.body) {
         process.stdout.write(chunk.toString());
    }
    console.log("\n\nTest completed successfully!");
  } catch (err) {
    console.error("Error during fetch:", err);
  }
}

testAI();
