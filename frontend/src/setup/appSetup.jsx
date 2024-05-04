let base_url;

let domain = document.domain;

if(domain === 'localhost') base_url = 'http://localhost:8080' 
else base_url = 'https://dreamlife-clinic.onrender.com';

export default base_url;