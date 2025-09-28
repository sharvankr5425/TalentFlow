import { faker } from '@faker-js/faker';
import Dexie from 'dexie';

export const db = new Dexie('talentflow');

// Define the database schema.
// We are defining a single, correct version of the schema.
db.version(2).stores({
  jobs: 'id, title, status, order', // Use 'id' (our UUID) as the primary key
  candidates: 'id, name, email, stage, jobId', // Use 'id' (our UUID) as the primary key
  assessments: 'jobId',
  feedback: '++id, candidateId, rating, recommendation',
  assessmentResponses: 'id, candidateId, jobId',
});


// --- DATA SEEDING ---
export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) {
    console.log("Database already seeded.");
    return;
  }
  console.log("Seeding database...");

  // Seed Jobs
  const jobsToSeed = [];
  for (let i = 0; i < 25; i++) {
    const title = faker.person.jobTitle();
    jobsToSeed.push({
      id: crypto.randomUUID(),
      title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      description: faker.lorem.paragraphs(3),
      status: faker.helpers.arrayElement(['active', 'archived']),
      tags: faker.helpers.arrayElements(['Remote', 'Full-time', 'Engineering', 'Marketing'], 2),
      order: i,
    });
  }
  await db.jobs.bulkAdd(jobsToSeed);

  // Seed Candidates
  const candidatesToSeed = [];
  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
  for (let i = 0; i < 1000; i++) {
    candidatesToSeed.push({
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      stage: faker.helpers.arrayElement(stages),
      jobId: faker.helpers.arrayElement(jobsToSeed).id,
      notes: [],
      timeline: [{ status: 'Applied', date: faker.date.recent({ days: 90 }) }],
    });
  }
  await db.candidates.bulkAdd(candidatesToSeed);
    
  // Seed Assessments
  const assessmentsToSeed = [];
  const jobsForAssessment = faker.helpers.arrayElements(jobsToSeed, 3);
  jobsForAssessment.forEach(job => {
      const questions = [];
      for(let i = 0; i < 12; i++) {
        const type = faker.helpers.arrayElement(['short-text', 'long-text', 'numeric', 'single-choice']);
          questions.push({
              id: `q_${crypto.randomUUID()}`,
              type: type,
              label: faker.lorem.sentence().replace('.', '?'),
              options: ['single-choice'].includes(type) ? Array.from({length: 4}, () => faker.lorem.word()) : [],
              validation: { required: faker.datatype.boolean() },
          });
      }
      assessmentsToSeed.push({ jobId: job.id, questions });
  });
  await db.assessments.bulkAdd(assessmentsToSeed);

  // Seed initial feedback data
  await seedFeedback();

  console.log("Database seeding complete.");
}

// Function to add some initial feedback data for V5
async function seedFeedback() {
    const feedbackCount = await db.feedback.count();
    if (feedbackCount > 0) return;

    const candidates = await db.candidates.limit(50).toArray();
    const feedbackData = [];

    for (const candidate of candidates) {
        const numberOfFeedbacks = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numberOfFeedbacks; i++) {
            feedbackData.push({
                candidateId: candidate.id,
                author: faker.person.fullName(),
                rating: faker.number.int({ min: 2, max: 5 }),
                pros: faker.lorem.sentence(),
                cons: faker.lorem.sentence(),
                recommendation: faker.helpers.arrayElement(['Strong Hire', 'Hire', 'No Hire']),
                submittedAt: faker.date.recent({ days: 10 }),
            });
        }
    }
    await db.feedback.bulkAdd(feedbackData);
    console.log('Feedback data seeded.');
}