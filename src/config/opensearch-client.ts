// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */

// import { Client } from '@opensearch-project/opensearch';

// let opensearchClient: Client;

// try {
//   opensearchClient = new Client({
//     node: process.env.OPENSEARCH_NODE,
//     auth: {
//       username: process.env.OPENSEARCH_USERNAME ?? '',
//       password: process.env.OPENSEARCH_PASSWORD ?? ''
//     },  
//     ssl: { rejectUnauthorized: true }
//   });
// } catch (error) {
//   console.error('Failed to initialize OpenSearch client:', error);
//   throw new Error('OpenSearch client initialization failed');
// }

// export default opensearchClient;