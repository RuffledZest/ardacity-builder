import React, { useState } from 'react';
import { gql, useQuery, ApolloProvider } from '@apollo/client';
import { apolloClient } from '../../lib/apollo-client';

// GraphQL query for searching transactions
const SEARCH_TRANSACTIONS = gql`
  query SearchTransactions($first: Int!, $tags: [TagFilter!]) {
    transactions(first: $first, tags: $tags) {
      edges {
        cursor
        node {
          id
          tags {
            name
            value
          }
          block {
            height
          }
          bundledIn {
            id
          }
        }
      }
    }
  }
`;

interface Tag {
  name: string;
  value: string;
}

interface Transaction {
  id: string;
  tags: Tag[];
  block: {
    height: number;
  };
  bundledIn: {
    id: string;
  } | null;
}

interface SearchResult {
  transactions: {
    edges: {
      cursor: string;
      node: Transaction;
    }[];
  };
}

interface ArweaveSearchProps {
  initialTags?: Tag[];
  limit?: number;
}

const ArweaveSearchContent: React.FC<ArweaveSearchProps> = ({
  initialTags = [],
  limit = 10,
}) => {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [tagName, setTagName] = useState('');
  const [tagValue, setTagValue] = useState('');

  const { loading, error, data, refetch } = useQuery<SearchResult>(SEARCH_TRANSACTIONS, {
    variables: {
      first: limit,
      tags: tags,
    },
  });

  const addTag = () => {
    if (tagName && tagValue) {
      setTags([...tags, { name: tagName, value: tagValue }]);
      setTagName('');
      setTagValue('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="arweave-search">
      <div className="search-controls">
        <div className="tag-inputs">
          <input
            type="text"
            placeholder="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tag Value"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
          />
          <button onClick={addTag}>Add Tag</button>
        </div>

        <div className="active-tags">
          {tags.map((tag, index) => (
            <div key={index} className="tag">
              {tag.name}: {tag.value}
              <button onClick={() => removeTag(index)}>×</button>
            </div>
          ))}
        </div>

        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="search-results">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && (
          <div className="transactions">
            {data.transactions.edges.map(({ node }) => (
              <div key={node.id} className="transaction">
                <h3>Transaction ID: {node.id}</h3>
                <p>Block Height: {node.block.height}</p>
                {node.bundledIn && (
                  <p>Bundled in: {node.bundledIn.id}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const ArweaveSearch: React.FC<ArweaveSearchProps> = (props) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ArweaveSearchContent {...props} />
    </ApolloProvider>
  );
}; 