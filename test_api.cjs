const https = require('https');

const data = JSON.stringify({
  message: 'payment failed'
});

const options = {
  hostname: '9htr20gx65.execute-api.ap-southeast-1.amazonaws.com',
  port: 443,
  path: '/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, res => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();
