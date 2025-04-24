// import opensearchClient from '~/config/opensearch-client';

// async function searchContent(query: string) {
//   try {
//     const response = await opensearchClient.search({
//       index: process.env.OPENSEARCH_INDEX ?? '',
//       body: {
//         query: {
//           match_phrase: {
//             content: query
//           }
//         },
//         highlight: {
//           fields: {
//             content: {
//               pre_tags: ["<strong>"],
//               post_tags: ["</strong>"],
//               fragment_size: 150,
//               number_of_fragments: 3
//             }
//           }
//         },
//         _source: ["content", "key"]
//       }
//     });
    
//     return response.body.hits.hits;
//   } catch (error) {
//     console.error('Search error:', error);
//     throw new Error('Failed to search content');
//   }
// }

// export default searchContent;