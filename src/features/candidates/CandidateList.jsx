import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';

// API function to fetch ALL candidates
const fetchAllCandidatesApi = async () => {
  const response = await fetch('/api/candidates/all');
  if (!response.ok) throw new Error('Failed to fetch candidates');
  return response.json();
};

export function CandidateList() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const parentRef = useRef(null);

  const { data: candidates = [], isLoading, isError } = useQuery({
    queryKey: ['allCandidates'],
    queryFn: fetchAllCandidatesApi,
  });

  const stages = useMemo(() => ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'], []);

  // Filter candidates on the client-side for a fast UI
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchesSearch = search ? 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.email.toLowerCase().includes(search.toLowerCase()) : true;
      
      const matchesStage = stageFilter !== 'All' ? c.stage === stageFilter : true;
      
      return matchesSearch && matchesStage;
    });
  }, [candidates, search, stageFilter]);

  // Setup for the virtualized list
  const rowVirtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 75, // Estimate height of each row
    overscan: 5,
  });

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Filter controls */}
      <Input
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={stageFilter}
        onChange={(e) => setStageFilter(e.target.value)}
        className="w-full p-2 border rounded-md bg-white border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {stages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
      </select>
      
      {/* List container with fixed height and scrollbar */}
      <div
        ref={parentRef}
        className="w-full flex-grow border rounded-lg overflow-y-auto"
        style={{ height: 'calc(100vh - 280px)' }} // Adjust height as needed
      >
        {isLoading ? (
          <p className="p-4 text-center">Loading candidates...</p>
        ) : isError ? (
          <p className="p-4 text-center text-red-500">Error loading candidates.</p>
        ) : (
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const candidate = filteredCandidates[virtualItem.index];
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="flex items-center p-4 border-b"
                >
                  <Link to={`/candidates/${candidate.id}`} className="flex items-center gap-4 w-full">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </div>
                    <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {candidate.stage}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

