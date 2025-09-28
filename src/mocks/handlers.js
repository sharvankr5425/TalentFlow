// import { http, HttpResponse } from 'msw';
// import { faker } from '@faker-js/faker';
// import { db } from '../lib/db';

// const API_PREFIX = '/api';

// // Utility to simulate network latency
// const delay = (ms) => new Promise(res => setTimeout(res, ms));
// const randomDelay = () => delay(Math.random() * 1000 + 200);

// export const handlers = [
//   // --- DASHBOARD ---
//   http.get(`${API_PREFIX}/dashboard-stats`, async () => {
//     await randomDelay();
//     const allJobs = await db.jobs.toArray();
//     const allCandidates = await db.candidates.toArray();
//     const openJobs = allJobs.filter(j => j.status === 'active').length;
//     const totalCandidates = allCandidates.length;
//     const funnelData = [
//       { stage: 'Applied', count: allCandidates.filter(c => c.stage === 'Applied').length },
//       { stage: 'Screening', count: allCandidates.filter(c => c.stage === 'Screening').length },
//       { stage: 'Interview', count: allCandidates.filter(c => c.stage === 'Interview').length },
//       { stage: 'Offer', count: allCandidates.filter(c => c.stage === 'Offer').length },
//       { stage: 'Hired', count: allCandidates.filter(c => c.stage === 'Hired').length },
//     ];
//     return HttpResponse.json({ openJobs, totalCandidates, funnelData });
//   }),

//   // --- JOBS ---
//   // (Existing job handlers remain unchanged)
//   http.get(`${API_PREFIX}/jobs`, async () => {
//     await randomDelay();
//     const allJobs = await db.jobs.orderBy('order').toArray();
//     return HttpResponse.json(allJobs);
//   }),
//   http.get(`${API_PREFIX}/jobs/:id`, async ({ params }) => {
//     await randomDelay();
//     const { id } = params;
//     const job = await db.jobs.get(id);
//     if (job) { return HttpResponse.json(job); }
//     return new HttpResponse(null, { status: 404 });
//   }),
//   http.post(`${API_PREFIX}/jobs`, async ({ request }) => {
//     await randomDelay();
//     const newJob = await request.json();
//     const jobCount = await db.jobs.count();
//     const jobToCreate = { ...newJob, id: crypto.randomUUID(), slug: newJob.title.toLowerCase().replace(/\s+/g, '-'), order: jobCount };
//     await db.jobs.add(jobToCreate);
//     return HttpResponse.json(jobToCreate, { status: 201 });
//   }),
//   http.patch(`${API_PREFIX}/jobs/:id`, async ({ request, params }) => {
//     await randomDelay();
//     const { id } = params;
//     const updates = await request.json();
//     await db.jobs.update(id, updates);
//     return HttpResponse.json({ id, ...updates });
//   }),
//   http.patch(`${API_PREFIX}/jobs/:id/reorder`, async ({ request }) => {
//     await randomDelay();
//     const { from, to } = await request.json();
//     if (Math.random() < 0.15) {
//       return new HttpResponse('Server error: Could not reorder jobs.', { status: 500 });
//     }
//     const allJobs = await db.jobs.orderBy('order').toArray();
//     const movedItem = allJobs.splice(from, 1)[0];
//     allJobs.splice(to, 0, movedItem);
//     await db.transaction('rw', db.jobs, async () => {
//       for (let i = 0; i < allJobs.length; i++) {
//         await db.jobs.update(allJobs[i].id, { order: i });
//       }
//     });
//     return HttpResponse.json({ success: true });
//   }),

//   // --- CANDIDATES ---
//   // (Existing candidate handlers remain unchanged)
//   http.get(`${API_PREFIX}/candidates`, async ({ request }) => {
//     await randomDelay();
//     const url = new URL(request.url);
//     const search = url.searchParams.get('search')?.toLowerCase();
//     const stage = url.searchParams.get('stage');
//     let candidates = await db.candidates.toArray();
//     if (search) {
//       candidates = candidates.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
//     }
//     if (stage && stage !== 'All') {
//       candidates = candidates.filter(c => c.stage === stage);
//     }
//     return HttpResponse.json(candidates);
//   }),
//   http.get(`${API_PREFIX}/candidates/:id`, async ({ params }) => {
//     await randomDelay();
//     const { id } = params;
//     const candidate = await db.candidates.get(id);
//     if (candidate) { return HttpResponse.json(candidate); }
//     return new HttpResponse(null, { status: 404, statusText: 'Candidate not found' });
//   }),
//   http.get(`${API_PREFIX}/candidates/:id/timeline`, async ({ params }) => {
//     await randomDelay();
//     const { id } = params;
//     const candidate = await db.candidates.get(id);
//     if (candidate && candidate.timeline) { return HttpResponse.json(candidate.timeline); }
//     return HttpResponse.json([], { status: 404 });
//   }),
//   http.patch(`${API_PREFIX}/candidates/:id`, async ({ request, params }) => {
//     await randomDelay();
//     const { id } = params;
//     const updates = await request.json();
//     await db.candidates.update(id, updates);
//     return HttpResponse.json({ id, ...updates });
//   }),

//   // NEW: Handler for fetching feedback for a specific candidate
//   http.get(`${API_PREFIX}/candidates/:candidateId/feedback`, async ({ params }) => {
//     await randomDelay();
//     const { candidateId } = params;
//     const feedback = await db.feedback.where({ candidateId }).sortBy('submittedAt');
//     return HttpResponse.json(feedback.reverse());
//   }),
  
//   // NEW: Handler for submitting new feedback
//   http.post(`${API_PREFIX}/candidates/:candidateId/feedback`, async ({ request, params }) => {
//     await randomDelay();
//     const { candidateId } = params;
//     const newFeedback = await request.json();
    
//     const feedbackData = {
//       ...newFeedback,
//       candidateId,
//       submittedAt: new Date().toISOString(),
//       author: faker.person.fullName(), // Simulate current user
//     };

//     await db.feedback.add(feedbackData);
//     return HttpResponse.json(feedbackData, { status: 201 });
//   }),

//   // --- ASSESSMENTS ---
//   // (Existing assessment handlers remain unchanged)
//   http.get(`${API_PREFIX}/assessments/:jobId`, async ({ params }) => {
//     await randomDelay();
//     const { jobId } = params;
//     const assessment = await db.assessments.get(jobId);
//     if (assessment) { return HttpResponse.json(assessment); }
//     return new HttpResponse(null, { status: 404 });
//   }),
//   http.put(`${API_PREFIX}/assessments/:jobId`, async ({ request, params }) => {
//     await randomDelay();
//     const { jobId } = params;
//     const assessmentData = await request.json();
//     await db.assessments.put({ jobId, ...assessmentData });
//     return HttpResponse.json({ jobId, ...assessmentData });
//   }),
  
//   // NEW: Handler for fetching a candidate's assessment responses
//   http.get(`${API_PREFIX}/candidates/:candidateId/assessment-responses`, async ({ params }) => {
//     await randomDelay();
//     const { candidateId } = params;
//     const responses = await db.assessmentResponses.get({ candidateId }); 
//     return HttpResponse.json(responses || null);
//   }),
// ];



import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { db } from '../lib/db';

const API_PREFIX = '/api';

const delay = (ms) => new Promise(res => setTimeout(res, ms));
const randomDelay = () => delay(Math.random() * 1000 + 200);

export const handlers = [
  // --- DASHBOARD ---
  http.get(`${API_PREFIX}/dashboard-stats`, async () => {
    await randomDelay();
    const allJobs = await db.jobs.toArray();
    const allCandidates = await db.candidates.toArray();
    const openJobs = allJobs.filter(j => j.status === 'active').length;
    const totalCandidates = allCandidates.length;
    const funnelData = [
      { stage: 'Applied', count: allCandidates.filter(c => c.stage === 'Applied').length },
      { stage: 'Screening', count: allCandidates.filter(c => c.stage === 'Screening').length },
      { stage: 'Interview', count: allCandidates.filter(c => c.stage === 'Interview').length },
      { stage: 'Offer', count: allCandidates.filter(c => c.stage === 'Offer').length },
      { stage: 'Hired', count: allCandidates.filter(c => c.stage === 'Hired').length },
    ];
    return HttpResponse.json({ openJobs, totalCandidates, funnelData });
  }),

  // --- JOBS ---
  http.get(`${API_PREFIX}/jobs`, async () => {
    await randomDelay();
    const allJobs = await db.jobs.orderBy('order').toArray();
    return HttpResponse.json(allJobs);
  }),
  http.get(`${API_PREFIX}/jobs/:id`, async ({ params }) => {
    await randomDelay();
    const { id } = params;
    const job = await db.jobs.get(id);
    if (job) { return HttpResponse.json(job); }
    return new HttpResponse(null, { status: 404 });
  }),
  http.post(`${API_PREFIX}/jobs`, async ({ request }) => {
    await randomDelay();
    const newJob = await request.json();
    const jobCount = await db.jobs.count();
    const jobToCreate = { ...newJob, id: crypto.randomUUID(), slug: newJob.title.toLowerCase().replace(/\s+/g, '-'), order: jobCount };
    await db.jobs.add(jobToCreate);
    return HttpResponse.json(jobToCreate, { status: 201 });
  }),
  http.patch(`${API_PREFIX}/jobs/:id`, async ({ request, params }) => {
    await randomDelay();
    const { id } = params;
    const updates = await request.json();
    await db.jobs.update(id, updates);
    return HttpResponse.json({ id, ...updates });
  }),
  http.patch(`${API_PREFIX}/jobs/:id/reorder`, async ({ request }) => {
    await randomDelay();
    const { from, to } = await request.json();
    if (Math.random() < 0.15) {
      return new HttpResponse('Server error: Could not reorder jobs.', { status: 500 });
    }
    const allJobs = await db.jobs.orderBy('order').toArray();
    const movedItem = allJobs.splice(from, 1)[0];
    allJobs.splice(to, 0, movedItem);
    await db.transaction('rw', db.jobs, async () => {
      for (let i = 0; i < allJobs.length; i++) {
        await db.jobs.update(allJobs[i].id, { order: i });
      }
    });
    return HttpResponse.json({ success: true });
  }),

  // --- CANDIDATES ---
  // This handler is ONLY for the paginated list view (not currently used, but good to have)
  http.get(`${API_PREFIX}/candidates`, async ({ request }) => {
    await randomDelay();
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const stage = url.searchParams.get('stage');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '15', 10);
    let candidates = await db.candidates.toArray();
    if (search) {
      candidates = candidates.filter(c => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
    }
    if (stage && stage !== 'All') {
      candidates = candidates.filter(c => c.stage === stage);
    }
    const totalCount = candidates.length;
    const paginatedData = candidates.slice((page - 1) * pageSize, page * pageSize);
    return HttpResponse.json({ candidates: paginatedData, totalCount });
  }),

  // THE FIX IS HERE: Dedicated handler for fetching ALL candidates.
  http.get(`${API_PREFIX}/candidates/all`, async () => {
    await randomDelay();
    const allCandidates = await db.candidates.toArray();
    // It now returns a simple array, which the CandidateList component expects.
    return HttpResponse.json(allCandidates);
  }),
  
  http.get(`${API_PREFIX}/candidates/:id`, async ({ params }) => {
    await randomDelay();
    const { id } = params;
    const candidate = await db.candidates.get(id);
    if (candidate) { return HttpResponse.json(candidate); }
    return new HttpResponse(null, { status: 404, statusText: 'Candidate not found' });
  }),
  http.get(`${API_PREFIX}/candidates/:id/timeline`, async ({ params }) => {
    await randomDelay();
    const { id } = params;
    const candidate = await db.candidates.get(id);
    if (candidate && candidate.timeline) { return HttpResponse.json(candidate.timeline); }
    return HttpResponse.json([], { status: 404 });
  }),
  http.patch(`${API_PREFIX}/candidates/:id`, async ({ request, params }) => {
    await randomDelay();
    const { id } = params;
    const updates = await request.json();
    await db.candidates.update(id, updates);
    return HttpResponse.json({ id, ...updates });
  }),
  http.get(`${API_PREFIX}/candidates/:candidateId/feedback`, async ({ params }) => {
    await randomDelay();
    const { candidateId } = params;
    const feedback = await db.feedback.where({ candidateId }).sortBy('submittedAt');
    return HttpResponse.json(feedback.reverse());
  }),
  http.post(`${API_PREFIX}/candidates/:candidateId/feedback`, async ({ request, params }) => {
    await randomDelay();
    const { candidateId } = params;
    const newFeedback = await request.json();
    const feedbackData = { ...newFeedback, candidateId, submittedAt: new Date().toISOString(), author: faker.person.fullName() };
    await db.feedback.add(feedbackData);
    return HttpResponse.json(feedbackData, { status: 201 });
  }),

  // --- ASSESSMENTS ---
  http.get(`${API_PREFIX}/assessments/:jobId`, async ({ params }) => {
    await randomDelay();
    const { jobId } = params;
    const assessment = await db.assessments.get(jobId);
    if (assessment) { return HttpResponse.json(assessment); }
    return new HttpResponse(null, { status: 404 });
  }),
  http.put(`${API_PREFIX}/assessments/:jobId`, async ({ request, params }) => {
    await randomDelay();
    const { jobId } = params;
    const assessmentData = await request.json();
    await db.assessments.put({ jobId, ...assessmentData });
    return HttpResponse.json({ jobId, ...assessmentData });
  }),
  http.get(`${API_PREFIX}/candidates/:candidateId/assessment-responses`, async ({ params }) => {
    await randomDelay();
    const { candidateId } = params;
    const responses = await db.assessmentResponses.get({ candidateId }); 
    return HttpResponse.json(responses || null);
  }),
];

