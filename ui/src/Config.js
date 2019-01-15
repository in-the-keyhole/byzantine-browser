
const  config = {apiserver: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4001'};

export { config };