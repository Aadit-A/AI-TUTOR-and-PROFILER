const dns = require('dns');

const domain = '_mongodb._tcp.ai-tutor.tgmvbi2.mongodb.net';

console.log(`Resolving SRV for: ${domain}`);

dns.resolveSrv(domain, (err, addresses) => {
  if (err) {
    console.error('❌ DNS Lookup Failed:', err);
    return;
  }

  console.log('✅ SRV Record Found:');
  console.log(JSON.stringify(addresses, null, 2));
  
  if (addresses && addresses.length > 0) {
      console.log('\nConstructing Standard Connection String...');
      const hosts = addresses.map(a => `${a.name}:${a.port}`).join(',');
      // We don't verify the replica set name here, but usually it can be omitted or guessed if we have the hosts.
      // Or we can try to connect to one to find the replica set name.
      console.log(`\nPotential Hosts: ${hosts}`);
  }
});
