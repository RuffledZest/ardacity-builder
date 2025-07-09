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
    <div className="w-full max-w-2xl mx-auto p-6 bg-black rounded-2xl shadow-2xl border border-zinc-800 mt-8 font-mono">
      <h2 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse" />
        Arweave Blockchain Search
      </h2>
      <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex flex-col md:flex-row gap-2 flex-1">
          <input
            type="text"
            placeholder="Tag Name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 placeholder:text-zinc-400 w-full md:w-40 transition"
          />
          <input
            type="text"
            placeholder="Tag Value"
            value={tagValue}
            onChange={(e) => setTagValue(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 placeholder:text-zinc-400 w-full md:w-56 transition"
          />
          <button
            onClick={addTag}
            className="bg-white text-black font-semibold px-4 py-2 rounded-lg border border-zinc-700 hover:bg-slate-800 hover:text-white transition"
          >
            Add Tag
          </button>
        </div>
        <button
          onClick={handleSearch}
          className="bg-zinc-800 text-white font-bold px-6 py-2 rounded-lg border border-zinc-700 shadow hover:bg-zinc-700 transition"
        >
          Search
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center bg-zinc-800 text-white px-3 py-1 rounded-full border border-zinc-600 text-xs font-semibold gap-2 shadow"
          >
            <span>{tag.name}: {tag.value}</span>
            <button
              onClick={() => removeTag(index)}
              className="ml-1 text-slate-400 hover:text-white focus:outline-none"
              title="Remove tag"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 min-h-[120px]">
        {loading && <p className="text-zinc-400">Loading...</p>}
        {error && <p className="text-red-400">Error: {error.message}</p>}
        {data && (
          <div className="grid gap-4">
            {data.transactions.edges.length === 0 && (
              <p className="text-zinc-400">No transactions found.</p>
            )}
            {data.transactions.edges.map(({ node }) => (
              <div
                key={node.id}
                className="block border border-zinc-700 bg-black rounded-lg p-4 shadow-md hover:border-slate-500 transition group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-zinc-400">Block</span>
                  <span className="text-white font-mono text-sm bg-zinc-900 px-2 py-0.5 rounded">
                    #{node.block.height}
                  </span>
                  {node.bundledIn && (
                    <span className="ml-2 text-xs text-slate-400 bg-zinc-900 px-2 py-0.5 rounded">
                      Bundled: {node.bundledIn.id.slice(0, 8)}…
                    </span>
                  )}
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="text-xs text-zinc-400">TxID:</span>
                  <span className="text-white font-mono text-sm break-all">
                    {node.id}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {node.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-zinc-900 text-zinc-200 border border-zinc-700 rounded px-2 py-0.5 text-xs font-mono"
                    >
                      {tag.name}: <span className="text-slate-400">{tag.value}</span>
                    </span>
                  ))}
                </div>
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