const baseUrl = process.env.API_URL || 'http://localhost:3000';

const response = await fetch(`${baseUrl}/api/health`);
if (!response.ok) throw new Error(`Health check failed with HTTP ${response.status}`);

const health = await response.json();
if (health.status !== 'ONLINE' || health.database !== 'CONNECTED') {
  throw new Error(`Unexpected health response: ${JSON.stringify(health)}`);
}

console.log(`KrishNex API smoke test passed: ${baseUrl}`);