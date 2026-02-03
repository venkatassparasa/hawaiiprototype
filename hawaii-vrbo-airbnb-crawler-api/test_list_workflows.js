const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3010,
  path: '/api/temporal/workflows',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`Response: ${body}`);
    const data = JSON.parse(body);
    console.log(`Found ${data.workflows.length} workflows`);
    data.workflows.forEach(w => {
      console.log(`- ${w.id}: ${w.type} (${w.status})`);
    });
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
