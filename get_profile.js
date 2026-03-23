const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/);
const url = urlMatch[1].trim();
const key = keyMatch[1].trim();

fetch(`${url}/rest/v1/assistant_config?select=profile_id&limit=1`, {
    headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
    }
}).then(r => r.json()).then(data => {
    if (data && data.length > 0) {
        console.log('PROFILE_ID=' + data[0].profile_id);
    } else {
        console.error("No profile ID found.");
    }
}).catch(console.error);
