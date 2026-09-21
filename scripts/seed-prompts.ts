import { db } from '../server/db';

type SeedPrompt = {
  title: string;
  userId: string;
  category: string;
  promptText: string;
  description: string;
  tags: string[];
  imageUrl: string;
  prototypeUrl: string;
  averageRating: number;
  ratingCount: number;
};

const researchPrompts: SeedPrompt[] = [
  {
    title: 'Humanize My Writing', userId: 'user_writer_4', category: 'Writing / Communication',
    promptText: `Edit the writing I provide so it sounds clear, natural, and recognizably human while preserving my meaning, facts, structure, and intended audience. Remove vague filler, repetitive transitions, inflated claims, and stiff phrasing without adding opinions or invented detail. Provide the revised version, explain the highest-impact changes, and offer a warmer or more direct tone variation when useful.`,
    description: 'Makes writing clearer and more natural while preserving the author meaning, facts, and voice.',
    tags: ['writing', 'editing', 'communication', 'clarity'], imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/humanize-my-writing', averageRating: 4.7, ratingCount: 47
  },
  {
    title: 'Professional WhatsApp Message', userId: 'user_student_3', category: 'Writing / Communication',
    promptText: `Rewrite my rough WhatsApp message for the recipient, relationship, situation, and desired action I provide. Preserve important facts and intended meaning, make the request easy to understand on a phone, and avoid sounding abrupt or overly formal. Give a concise version, a warmer version, and a firm-but-respectful version when the context involves a boundary or deadline.`,
    description: 'Turns rough messages into concise, respectful WhatsApp communication with useful tone choices.',
    tags: ['writing', 'whatsapp', 'communication', 'tone'], imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/professional-whatsapp-message', averageRating: 4.2, ratingCount: 18
  },
  {
    title: 'Email Rewriter', userId: 'user_writer_4', category: 'Writing / Communication',
    promptText: `Rewrite my email for the audience, relationship, purpose, and tone I specify. Keep every material fact and requested action, make the subject and next step clear, and remove unnecessary defensiveness or ambiguity. Give a concise polished version and a warmer or more assertive alternative, then flag any missing date, owner, attachment, or decision that could cause a follow-up loop.`,
    description: 'Improves email clarity and tone while preserving facts, requests, and missing-context warnings.',
    tags: ['writing', 'email', 'editing', 'communication'], imageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/email-rewriter', averageRating: 4.5, ratingCount: 31
  },
  {
    title: 'Difficult Conversation Planner', userId: 'user_expert_1', category: 'Writing / Communication',
    promptText: `Help me prepare for a difficult conversation using the situation, relationship, facts, impact, boundary, and desired outcome I provide. Separate observations from interpretations, suggest a calm opening, anticipate likely concerns, and offer language that is direct without blame. Include listening questions, a fallback boundary, and a short follow-up note without pretending to know the other person's intent.`,
    description: 'Plans difficult conversations around facts, impact, boundaries, listening, and respectful next steps.',
    tags: ['writing', 'communication', 'conflict', 'boundaries'], imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/difficult-conversation-planner', averageRating: 4.6, ratingCount: 28
  },
  {
    title: 'Smart Trip Planner', userId: 'user_student_3', category: 'Travel / Lifestyle',
    promptText: `Plan a practical trip from the destination, dates, budget, travelers, interests, pace, mobility needs, and transport preferences I provide. Group activities by area, balance highlights with rest, allow realistic travel and meal time, and provide weather alternatives. Separate suggestions from details that require current verification, especially opening hours, reservations, prices, visas, and local safety guidance.`,
    description: 'Builds realistic, constraint-aware itineraries with grouping, rest, alternatives, and verification notes.',
    tags: ['travel', 'itinerary', 'planning', 'lifestyle'], imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/smart-trip-planner', averageRating: 4.7, ratingCount: 39
  },
  {
    title: 'Packing List Generator', userId: 'user_writer_4', category: 'Travel / Lifestyle',
    promptText: `Create a prioritized packing list from the destination, weather, trip length, activities, luggage limits, laundry access, health needs, and preferences I provide. Separate essentials, useful extras, and optional items, suggest outfit combinations that reuse pieces, and include a departure checklist for documents, devices, medication, and chargers. Flag anything that depends on current airline or local rules.`,
    description: 'Builds a lightweight, activity-aware packing list that respects luggage, weather, and practical constraints.',
    tags: ['travel', 'packing', 'planning', 'lifestyle'], imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/packing-list-generator', averageRating: 4.4, ratingCount: 22
  },
  {
    title: 'Business Idea Stress Tester', userId: 'user_expert_1', category: 'Business / Research / Finance',
    promptText: `Stress-test the business idea, customer, problem, solution, pricing, alternatives, and evidence I provide. List core assumptions, rank them by consequence and uncertainty, and design cheap experiments that could disprove each one. Separate facts from guesses, identify regulatory or operational dependencies, and finish with a cautious proceed, revise, or stop recommendation supported by explicit limitations.`,
    description: 'Challenges business ideas through ranked assumptions, disconfirming experiments, and explicit limitations.',
    tags: ['business', 'startup', 'research', 'validation'], imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/business-idea-stress-tester', averageRating: 4.8, ratingCount: 43
  },
  {
    title: 'Research Paper Summarizer', userId: 'user_writer_4', category: 'Business / Research / Finance',
    promptText: `Summarize the research paper I provide for a busy reader without flattening important uncertainty. State the research question, design, sample, measures, findings, limitations, and practical relevance, distinguishing the authors' claims from your interpretation. Do not invent missing data or citations; identify what should be verified, define specialized terms, and finish with three questions a careful reader should ask.`,
    description: 'Creates careful research summaries that preserve methods, uncertainty, limitations, and verification needs.',
    tags: ['research', 'academic', 'summary', 'evidence'], imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/research-paper-summarizer-business', averageRating: 4.6, ratingCount: 36
  },
  {
    title: 'Personal Budget Analyzer', userId: 'user_student_3', category: 'Business / Research / Finance',
    promptText: `Analyze my income, recurring costs, variable transactions, debts, savings goals, and irregular expenses as a planning exercise rather than guaranteed financial advice. Categorize consistently, find recurring patterns and cash-flow pressure points, separate facts from assumptions, and suggest realistic scenarios with trade-offs. Flag information that needs verification and avoid recommending products, returns, or regulated actions as certainties.`,
    description: 'Analyzes personal cash flow and spending scenarios with clear assumptions and non-advisory limits.',
    tags: ['finance', 'budgeting', 'analysis', 'planning'], imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/personal-budget-analyzer', averageRating: 4.3, ratingCount: 25
  },
  {
    title: 'Competitor Research Assistant', userId: 'user_expert_1', category: 'Business / Research / Finance',
    promptText: `Structure competitor research from the market, customer segment, companies, evidence, and questions I provide. Compare positioning, audience, capabilities, pricing signals, channels, strengths, weaknesses, and switching barriers using a consistent framework. Label facts, inferences, and gaps separately, never fabricate sources or current numbers, and finish with differentiated hypotheses that require testing rather than presenting conclusions as certainty.`,
    description: 'Organizes competitive research into evidence, gaps, comparable signals, and testable hypotheses.',
    tags: ['business', 'research', 'competitors', 'strategy'], imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/competitor-research-assistant', averageRating: 4.7, ratingCount: 33
  },
  {
    title: 'Repository Release Notes Assistant', userId: 'user_dev_2', category: 'Coding / Development',
    promptText: `Turn the commits, pull requests, issue labels, and verified test results I provide into release notes for developers and end users. Group changes by feature, fix, performance, and breaking behavior, explain impact in plain language, and call out migrations or known limitations. Do not infer shipped behavior from an unmerged change or invent version numbers, dates, or claims.`,
    description: 'Creates trustworthy release notes from verified repository changes, impact, migrations, and limitations.',
    tags: ['coding', 'git', 'release-notes', 'documentation'], imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/repository-release-notes', averageRating: 4.5, ratingCount: 19
  },
  {
    title: 'API Contract Test Planner', userId: 'user_expert_1', category: 'Coding / Development',
    promptText: `Create a focused API contract test plan from the routes, schemas, authentication rules, status codes, and client expectations I provide. Cover happy paths, validation failures, authorization boundaries, response shape compatibility, and important state transitions. Prioritize high-risk cases, provide concrete request examples, and distinguish observed contract behavior from assumptions that require confirmation.`,
    description: 'Plans contract-focused API tests for behavior, authorization, validation, and response compatibility.',
    tags: ['coding', 'api', 'testing', 'quality'], imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=803&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/api-contract-test-planner', averageRating: 4.7, ratingCount: 27
  },
  {
    title: 'Evidence Synthesis Brief Builder', userId: 'user_writer_4', category: 'Business / Research / Finance',
    promptText: `Build a decision brief from the studies, reports, metrics, and stakeholder question I provide. Summarize the strongest evidence, compare disagreement and quality, separate facts from interpretation, and identify missing information that could change the recommendation. Do not fabricate sources or precision; state limitations clearly and finish with a cautious recommendation plus the next evidence-gathering step.`,
    description: 'Combines research and business evidence into a cautious, source-aware decision brief.',
    tags: ['research', 'business', 'evidence', 'analysis'], imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=803&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/evidence-synthesis-brief', averageRating: 4.6, ratingCount: 21
  }
];

const seedPrompts: SeedPrompt[] = [
  {
    title: 'ATS Resume Optimizer',
    userId: 'user_student_3',
    category: 'Career',
    promptText: `Act as an ATS resume strategist for the target role I provide. Compare my resume with the job description, identify missing skills and measurable achievements, then rewrite the weakest bullets using clear action verbs and evidence. Keep the claims truthful, preserve my experience, and finish with a focused keyword checklist and three interview talking points.`,
    description: 'Tailors a truthful resume to a target role while improving ATS alignment and measurable impact.',
    tags: ['career', 'resume', 'job-search', 'ats'],
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/ats-resume-optimizer',
    averageRating: 4.6,
    ratingCount: 28
  },
  {
    title: 'Technical Interview Coach',
    userId: 'user_dev_2',
    category: 'Career',
    promptText: `Act as a practical technical interview coach for the role and seniority I name. Ask one question at a time across fundamentals, problem solving, communication, and system design. Wait for my answer, score it against a clear rubric, point out missing reasoning, and provide a stronger sample answer without pretending I know tools or experience I have not mentioned.`,
    description: 'Runs a structured technical interview practice session with feedback and honest scoring.',
    tags: ['career', 'interview', 'job-search', 'coaching'],
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/technical-interview-coach',
    averageRating: 4.8,
    ratingCount: 41
  },
  {
    title: 'LinkedIn Profile Builder',
    userId: 'user_writer_4',
    category: 'Career',
    promptText: `Rewrite my LinkedIn profile for the audience and career direction I provide. Create a specific headline, an approachable About section, and experience bullets that show outcomes rather than duties. Keep the voice credible and human, avoid inflated buzzwords, suggest five relevant keywords, and include three short post ideas that support the positioning.`,
    description: 'Builds a credible LinkedIn presence around a clear professional position and audience.',
    tags: ['career', 'linkedin', 'personal-brand', 'job-search'],
    imageUrl: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/linkedin-profile-builder',
    averageRating: 4.4,
    ratingCount: 17
  },
  {
    title: 'Explain Complex Code',
    userId: 'user_dev_2',
    category: 'Coding',
    promptText: `Explain the code I provide to a developer who understands the language basics but not this system. Start with the purpose and data flow, then walk through the important functions, assumptions, and failure paths in execution order. Call out complexity, hidden side effects, and unclear naming, and finish with a small example using realistic input and output.`,
    description: 'Turns unfamiliar source code into a clear explanation of purpose, flow, and risks.',
    tags: ['coding', 'programming', 'code-review', 'documentation'],
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/explain-complex-code',
    averageRating: 4.7,
    ratingCount: 36
  },
  {
    title: 'Debugging Assistant',
    userId: 'user_expert_1',
    category: 'Coding',
    promptText: `Act as a methodical debugging partner. Analyze the code, error message, expected behavior, and smallest reproducible input I provide. Separate confirmed facts from hypotheses, rank likely root causes, and propose the least invasive fix with a regression test. Do not rewrite unrelated code, and ask only for the missing context required to distinguish competing explanations.`,
    description: 'Guides evidence-based debugging from reproducible failure to focused regression test.',
    tags: ['coding', 'debugging', 'testing', 'programming'],
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/debugging-assistant',
    averageRating: 4.9,
    ratingCount: 63
  },
  {
    title: 'System Design Planner',
    userId: 'user_dev_2',
    category: 'Coding',
    promptText: `Help me design the system described in the problem statement. First clarify users, scale, latency, consistency, and reliability goals. Then propose APIs, core data models, components, and request flows. Estimate capacity with explicit assumptions, identify bottlenecks and failure recovery, compare one alternative architecture, and end with a concise trade-off summary suitable for an interview or design review.`,
    description: 'Creates an interview-ready system design with explicit requirements, estimates, and trade-offs.',
    tags: ['coding', 'system-design', 'architecture', 'scalability'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/system-design-planner',
    averageRating: 4.8,
    ratingCount: 52
  },
  {
    title: 'Social Media Campaign Generator',
    userId: 'user_writer_4',
    category: 'Marketing',
    promptText: `Create a two-week social media campaign for the product, audience, channel mix, and business goal I provide. Define the central message, content pillars, daily post ideas, hooks, calls to action, and simple creative direction. Vary the formats by platform, avoid unsupported claims, and finish with a practical measurement plan tied to awareness, engagement, and conversion.`,
    description: 'Plans a channel-aware social campaign with varied content, calls to action, and measurement.',
    tags: ['marketing', 'social-media', 'content', 'campaign'],
    imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/social-campaign-generator',
    averageRating: 4.5,
    ratingCount: 24
  },
  {
    title: 'Product Launch Strategy',
    userId: 'user_expert_1',
    category: 'Marketing',
    promptText: `Build a realistic launch strategy for the product, market, timeline, and budget I provide. Segment the audience, clarify positioning against alternatives, and map pre-launch, launch-week, and post-launch activities across owned, earned, and paid channels. Include dependencies, risks, a small experiment backlog, and success metrics that distinguish attention from qualified demand.`,
    description: 'Maps product positioning, launch activities, experiments, risks, and demand-focused metrics.',
    tags: ['marketing', 'product-launch', 'branding', 'strategy'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/product-launch-strategy',
    averageRating: 4.9,
    ratingCount: 47
  },
  {
    title: 'SEO Content Planner',
    userId: 'user_writer_4',
    category: 'Marketing',
    promptText: `Create an SEO content plan for the topic, audience, and business objective I provide. Group search intent into a useful topic cluster, recommend a pillar page and supporting articles, and give each a working title, outline, internal-link target, and conversion goal. Prioritize reader usefulness over keyword stuffing and state assumptions where search data is unavailable.`,
    description: 'Builds a useful topic cluster that connects search intent, content structure, and conversion goals.',
    tags: ['marketing', 'seo', 'content', 'keyword-research'],
    imageUrl: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/seo-content-planner',
    averageRating: 4.3,
    ratingCount: 19
  },
  {
    title: 'Personalized Study Tutor',
    userId: 'user_student_3',
    category: 'Education',
    promptText: `Act as a patient tutor for the subject, level, and learning goal I provide. Begin by checking my current understanding with two short questions, then teach one concept at a time using a concrete example. Ask me to explain it back, correct misconceptions gently, and adapt the next explanation based on my answer rather than delivering an uninterrupted lecture.`,
    description: 'Adapts explanations and questions to a learner instead of delivering a generic lecture.',
    tags: ['education', 'learning', 'study', 'tutoring'],
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/personalized-study-tutor',
    averageRating: 4.8,
    ratingCount: 35
  },
  {
    title: 'Exam Revision Planner',
    userId: 'user_student_3',
    category: 'Education',
    promptText: `Create a revision plan from my subjects, exam dates, available hours, confidence levels, and existing commitments. Allocate retrieval practice, worked examples, review intervals, and timed tests rather than only reading. Make the schedule achievable with buffer time, define a daily stopping point, and include a weekly checkpoint that reprioritizes weak areas from evidence.`,
    description: 'Turns exam dates and confidence levels into an achievable evidence-based revision schedule.',
    tags: ['education', 'exam', 'study', 'planning'],
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/exam-revision-planner',
    averageRating: 4.6,
    ratingCount: 29
  },
  {
    title: 'UI/UX Critique Assistant',
    userId: 'user_expert_1',
    category: 'Design',
    promptText: `Critique the interface description, flow, or screenshot I provide from a usability and accessibility perspective. Start with the primary user goal, then identify friction in hierarchy, navigation, feedback, content, and error recovery. Separate observations from assumptions, prioritize the three highest-impact changes, and describe a concrete revision with keyboard, mobile, and assistive-technology considerations.`,
    description: 'Prioritizes practical usability and accessibility improvements from interface evidence.',
    tags: ['design', 'ui-ux', 'usability', 'accessibility'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/ui-ux-critique',
    averageRating: 4.7,
    ratingCount: 31
  },
  {
    title: 'Design System Generator',
    userId: 'user_expert_1',
    category: 'Design',
    promptText: `Create a compact design system foundation for the product context I provide. Define accessible color roles, typography hierarchy, spacing, elevation, and interaction states as reusable tokens. Then specify a small set of components with variants, states, content rules, and responsive behavior. Keep the system coherent, implementation-friendly, and explicit about contrast and focus requirements.`,
    description: 'Produces implementation-ready design tokens and component rules for a coherent product interface.',
    tags: ['design', 'design-system', 'figma', 'typography'],
    imageUrl: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/design-system-generator',
    averageRating: 4.5,
    ratingCount: 22
  },
  {
    title: 'Blog Outline Generator',
    userId: 'user_writer_4',
    category: 'Writing',
    promptText: `Create a reader-first outline for a blog post about the topic and audience I provide. Establish the promise, define the reader's starting problem, and organize the article into a logical sequence of sections with useful subpoints. Suggest examples, evidence to verify, a concise introduction, a practical conclusion, and a title that is clear without using clickbait.`,
    description: 'Builds useful article structures with a clear reader promise, evidence needs, and conclusion.',
    tags: ['writing', 'blog', 'content', 'storytelling'],
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/blog-outline-generator',
    averageRating: 4.4,
    ratingCount: 16
  },
  {
    title: 'Professional Email Writer',
    userId: 'user_writer_4',
    category: 'Writing',
    promptText: `Rewrite my rough email for the recipient, relationship, purpose, and tone I specify. Preserve the facts and requested action, remove unnecessary defensiveness, and make the next step easy to find. Provide a concise subject line, the polished version, and one warmer alternative. Flag any missing context or commitment that could cause confusion before I send it.`,
    description: 'Turns rough messages into clear, respectful emails with an explicit next action.',
    tags: ['writing', 'email', 'copywriting', 'communication'],
    imageUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/professional-email-writer',
    averageRating: 4.2,
    ratingCount: 12
  },
  {
    title: 'Weekly Productivity Planner',
    userId: 'user_student_3',
    category: 'Productivity',
    promptText: `Turn my commitments, goals, energy patterns, and available time into a realistic weekly plan. Separate essential outcomes from optional tasks, reserve focus blocks and recovery time, and identify the first physical action for each priority. Include a short daily review and a Friday reflection that captures what changed without encouraging an overloaded schedule.`,
    description: 'Creates a capacity-aware weekly plan focused on outcomes, energy, and recovery.',
    tags: ['productivity', 'planning', 'workflow', 'organization'],
    imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/weekly-productivity-planner',
    averageRating: 4.6,
    ratingCount: 38
  },
  {
    title: 'Meeting-to-Action Converter',
    userId: 'user_dev_2',
    category: 'Productivity',
    promptText: `Convert the meeting notes or transcript I provide into a concise decision record. Separate decisions, open questions, risks, and action items, assigning owners and due dates only when stated or clearly inferable. Highlight contradictions and missing commitments, then produce a follow-up message that confirms responsibilities without inventing details or turning discussion into false agreement.`,
    description: 'Converts meetings into trustworthy decisions, owners, questions, and follow-up actions.',
    tags: ['productivity', 'meetings', 'organization', 'workflow'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/meeting-to-action',
    averageRating: 4.9,
    ratingCount: 56
  },
  {
    title: 'Business Idea Validator',
    userId: 'user_expert_1',
    category: 'Business',
    promptText: `Evaluate the business idea, target customer, problem, and proposed solution I provide. Distinguish evidence from assumptions, identify the most credible alternatives, and design five low-cost validation experiments with success signals. Estimate the riskiest dependencies, suggest customer interview questions, and finish with a go, revise, or stop recommendation supported by explicit reasoning.`,
    description: 'Tests a business idea through assumptions, customer evidence, alternatives, and cheap experiments.',
    tags: ['business', 'strategy', 'startup', 'entrepreneurship'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/business-idea-validator',
    averageRating: 4.7,
    ratingCount: 44
  },
  {
    title: 'Competitor Analysis Assistant',
    userId: 'user_expert_1',
    category: 'Business',
    promptText: `Create a competitor analysis from the companies, market, and customer segment I provide. Compare positioning, audience, pricing logic, strengths, weaknesses, channels, and likely switching barriers without presenting guesses as facts. Identify underserved needs, define a fair comparison framework, and recommend three differentiated moves that can be tested within the team's actual constraints.`,
    description: 'Structures competitive research into fair comparisons, market gaps, and testable strategic moves.',
    tags: ['business', 'analysis', 'strategy', 'market-research'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/competitor-analysis',
    averageRating: 4.3,
    ratingCount: 21
  },
  {
    title: 'Travel Itinerary Planner',
    userId: 'user_student_3',
    category: 'Other',
    promptText: `Plan a practical itinerary for the destination, dates, budget, interests, mobility needs, and travel pace I provide. Group activities by area to reduce unnecessary transit, keep realistic opening and travel time buffers, and include weather-friendly alternatives. Flag reservations, local rules, and safety details that must be verified instead of inventing current availability or prices.`,
    description: 'Builds balanced travel days around interests, budget, accessibility, transit, and verification needs.',
    tags: ['travel', 'planning', 'lifestyle', 'itinerary'],
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/travel-itinerary-planner',
    averageRating: 4.1,
    ratingCount: 9
  },
  {
    title: 'SQL Query Optimizer',
    userId: 'user_dev_2',
    category: 'Coding',
    promptText: `Review the SQL query, schema details, database engine, and performance symptoms I provide. Explain the query plan in plain language, identify expensive joins, filters, scans, or sorting, and propose an optimized version without changing the result. State indexing and correctness trade-offs, note assumptions, and include a small verification checklist using realistic test data.`,
    description: 'Improves slow SQL with query-plan reasoning, safe rewrites, and index recommendations.',
    tags: ['coding', 'sql', 'performance', 'databases'],
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/sql-query-optimizer',
    averageRating: 4.8,
    ratingCount: 34
  },
  {
    title: 'Git Commit & PR Assistant',
    userId: 'user_dev_2',
    category: 'Coding',
    promptText: `Analyze the code changes, issue context, and reviewer audience I provide. Suggest a concise conventional commit message and a pull request description with summary, implementation notes, testing evidence, risks, and rollout considerations. Do not claim tests or behavior that are not shown, and call out any missing context a reviewer needs before approval.`,
    description: 'Creates accurate commit messages and review-friendly pull request descriptions from real changes.',
    tags: ['coding', 'git', 'code-review', 'collaboration'],
    imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/git-pr-assistant',
    averageRating: 4.5,
    ratingCount: 27
  },
  {
    title: 'API Documentation Generator',
    userId: 'user_expert_1',
    category: 'Coding',
    promptText: `Generate developer documentation from the API routes, request schemas, response examples, authentication rules, and error behavior I provide. Organize it by resource, show realistic curl and JSON examples, explain pagination and validation, and distinguish observed behavior from recommendations. Finish with an OpenAPI-ready endpoint checklist and a list of undocumented assumptions.`,
    description: 'Turns API implementation details into accurate, example-led developer documentation.',
    tags: ['coding', 'api', 'documentation', 'openapi'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/api-documentation-generator',
    averageRating: 4.7,
    ratingCount: 39
  },
  {
    title: 'Data Analysis Assistant',
    userId: 'user_expert_1',
    category: 'Data & Analytics',
    promptText: `Analyze the dataset description, columns, business question, and sample rows I provide. Begin by checking data quality, missingness, duplicates, and possible bias before calculating results. Recommend appropriate summaries or visualizations, separate correlation from causation, explain findings for a nontechnical audience, and finish with reproducible next steps and questions that need better data.`,
    description: 'Guides trustworthy data analysis from quality checks through clear, evidence-based recommendations.',
    tags: ['data', 'analytics', 'visualization', 'insights'],
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/data-analysis-assistant',
    averageRating: 4.6,
    ratingCount: 32
  },
  {
    title: 'Excel Formula Helper',
    userId: 'user_student_3',
    category: 'Data & Analytics',
    promptText: `Create or debug an Excel formula for the worksheet structure, desired result, and sample values I provide. Explain the formula from left to right, account for blanks and errors, and offer a readable alternative when useful. State whether the solution works in modern Excel or older versions, and include two test examples that demonstrate expected results.`,
    description: 'Builds understandable Excel formulas with compatibility notes, error handling, and test examples.',
    tags: ['data', 'excel', 'spreadsheets', 'analysis'],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/excel-formula-helper',
    averageRating: 4.4,
    ratingCount: 18
  },
  {
    title: 'Research Paper Summarizer',
    userId: 'user_writer_4',
    category: 'Research',
    promptText: `Summarize the research paper I provide for a reader who understands the field but has not read it. Identify the research question, method, sample, key findings, limitations, and practical significance without overstating the evidence. Define necessary terms, distinguish author claims from your interpretation, and finish with three careful questions for discussion or replication.`,
    description: 'Produces evidence-aware research summaries that preserve method, limitations, and significance.',
    tags: ['research', 'academic', 'summary', 'evidence'],
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/research-paper-summarizer',
    averageRating: 4.8,
    ratingCount: 45
  },
  {
    title: 'Literature Review Assistant',
    userId: 'user_expert_1',
    category: 'Research',
    promptText: `Help me organize the sources, research question, and inclusion criteria I provide into a rigorous literature review plan. Group studies by themes, methods, populations, or findings rather than listing them one by one. Identify agreements, contradictions, gaps, and quality concerns, never invent citations, and finish with a synthesis structure and search terms for the next round.`,
    description: 'Synthesizes research sources into themes, gaps, disagreements, and a defensible review structure.',
    tags: ['research', 'literature', 'academic', 'synthesis'],
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/literature-review-assistant',
    averageRating: 4.7,
    ratingCount: 26
  },
  {
    title: 'Flashcard Generator',
    userId: 'user_student_3',
    category: 'Education',
    promptText: `Turn the lesson notes or source material I provide into high-quality study flashcards. Prefer one testable idea per card, use retrieval-friendly questions, include concise answers and a useful example, and vary recall and application prompts. Avoid copying filler text, mark ambiguous claims for review, and group the cards by concept so I can study them progressively.`,
    description: 'Creates focused retrieval-practice flashcards from lessons while avoiding vague or overloaded cards.',
    tags: ['education', 'flashcards', 'learning', 'study'],
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/flashcard-generator',
    averageRating: 4.5,
    ratingCount: 33
  },
  {
    title: 'Language Learning Partner',
    userId: 'user_writer_4',
    category: 'Education',
    promptText: `Act as a supportive conversation partner for my target language and current level. Hold a realistic conversation one turn at a time, adjust difficulty gradually, and correct only the most useful errors after I respond. Explain corrections briefly in my preferred language, introduce natural vocabulary in context, and end each session with a short review and practice challenge.`,
    description: 'Provides adaptive language conversation practice with focused corrections and contextual vocabulary.',
    tags: ['education', 'language', 'conversation', 'learning'],
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/language-learning-partner',
    averageRating: 4.6,
    ratingCount: 37
  },
  {
    title: 'Financial Budget Planner',
    userId: 'user_student_3',
    category: 'Finance',
    promptText: `Build a practical monthly budget from my income, fixed costs, variable spending, debts, savings goals, and irregular expenses. Separate needs, wants, obligations, and flexible trade-offs, then recommend realistic spending limits without giving regulated financial advice. Include a simple cash-flow calendar, an emergency buffer plan, and three adjustments ordered by likely impact and effort.`,
    description: 'Creates a realistic cash-flow budget that accounts for irregular expenses and achievable savings.',
    tags: ['finance', 'budgeting', 'money', 'planning'],
    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/financial-budget-planner',
    averageRating: 4.4,
    ratingCount: 23
  },
  {
    title: 'Personal Expense Analyzer',
    userId: 'user_expert_1',
    category: 'Finance',
    promptText: `Analyze the expense list or transaction summary I provide without exposing sensitive personal details. Categorize spending consistently, identify recurring charges and meaningful changes, and distinguish one-time anomalies from habits. Explain the largest controllable drivers, suggest questions before cutting essentials, and produce a monthly review template rather than making assumptions about my financial priorities.`,
    description: 'Finds useful spending patterns and recurring costs while keeping financial recommendations grounded.',
    tags: ['finance', 'expenses', 'budgeting', 'analysis'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/personal-expense-analyzer',
    averageRating: 4.3,
    ratingCount: 15
  },
  {
    title: 'Project Risk Analyzer',
    userId: 'user_dev_2',
    category: 'Business',
    promptText: `Analyze the project plan, milestones, dependencies, resources, and constraints I provide. Build a risk register with probability, impact, early warning signs, owner, mitigation, and contingency actions. Separate risks from current issues and assumptions, prioritize the few risks that could change the outcome, and finish with five questions for the next project review.`,
    description: 'Turns project uncertainty into a prioritized risk register with owners and response actions.',
    tags: ['business', 'project', 'risk', 'planning'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/project-risk-analyzer',
    averageRating: 4.8,
    ratingCount: 42
  },
  {
    title: 'Business Proposal Writer',
    userId: 'user_writer_4',
    category: 'Business',
    promptText: `Draft a persuasive business proposal from the client context, problem, solution, scope, timeline, and evidence I provide. Lead with the client's desired outcome, explain the approach in plain language, define deliverables and assumptions, and present pricing or options transparently. Avoid unsupported promises, include acceptance criteria, and end with a clear decision and next-step section.`,
    description: 'Creates client-focused proposals with clear scope, evidence, options, and acceptance criteria.',
    tags: ['business', 'proposal', 'sales', 'writing'],
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/business-proposal-writer',
    averageRating: 4.6,
    ratingCount: 29
  },
  {
    title: 'Customer Support Response Builder',
    userId: 'user_writer_4',
    category: 'Customer Support',
    promptText: `Write a customer support response using the issue, account context, policy, and available resolution steps I provide. Acknowledge the customer's actual problem, explain the next action without blame, and be precise about timelines and limitations. Offer a short version and an empathetic version, flag any policy uncertainty, and never invent refunds, credits, or technical facts.`,
    description: 'Builds accurate, empathetic support replies that respect policy and make the next action clear.',
    tags: ['support', 'customer-service', 'communication', 'writing'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/customer-support-response',
    averageRating: 4.5,
    ratingCount: 31
  },
  {
    title: 'Product Requirements Generator',
    userId: 'user_expert_1',
    category: 'Product',
    promptText: `Turn the product problem, users, evidence, constraints, and desired outcome I provide into a concise requirements document. Define the problem and non-goals, user needs, functional requirements, quality attributes, acceptance criteria, dependencies, and open questions. Separate must-have scope from later ideas and make every requirement testable without prescribing unnecessary implementation details.`,
    description: 'Produces testable product requirements with clear scope, non-goals, dependencies, and acceptance criteria.',
    tags: ['product', 'requirements', 'planning', 'product-management'],
    imageUrl: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/product-requirements-generator',
    averageRating: 4.9,
    ratingCount: 58
  },
  {
    title: 'User Story Generator',
    userId: 'user_student_3',
    category: 'Product',
    promptText: `Convert the user problem, context, and desired outcome I provide into well-scoped user stories. Identify the actor, capability, value, acceptance criteria, edge cases, and dependencies, using concrete Given-When-Then examples where helpful. Challenge vague language, avoid solution-first requirements, and split stories that are too large to implement and validate within one iteration.`,
    description: 'Turns user needs into small, testable stories with acceptance criteria and edge cases.',
    tags: ['product', 'user-stories', 'agile', 'requirements'],
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/user-story-generator',
    averageRating: 4.7,
    ratingCount: 46
  },
  {
    title: 'Habit Tracker Coach',
    userId: 'user_student_3',
    category: 'Productivity',
    promptText: `Help me design a sustainable habit around the goal, schedule, environment, and barriers I provide. Reduce the goal to a small observable behavior, attach it to a reliable cue, and define a minimum version for difficult days. Suggest a simple tracking method, a weekly review, and recovery steps for missed days without using shame or unrealistic streak pressure.`,
    description: 'Designs compassionate, measurable habits with cues, minimum actions, and recovery plans.',
    tags: ['productivity', 'habits', 'goals', 'wellbeing'],
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/habit-tracker-coach',
    averageRating: 4.2,
    ratingCount: 20
  },
  {
    title: 'Meal Planning Assistant',
    userId: 'user_writer_4',
    category: 'Lifestyle',
    promptText: `Create a practical meal plan from my household size, dietary preferences, budget, schedule, cooking equipment, and ingredients already available. Balance variety with reuse of ingredients, include preparation shortcuts and storage guidance, and provide a categorized shopping list. Ask about allergies or restrictions before making assumptions and label any nutrition guidance as general information rather than medical advice.`,
    description: 'Builds budget-aware meal plans around real schedules, ingredients, preferences, and preparation limits.',
    tags: ['lifestyle', 'meal-planning', 'cooking', 'organization'],
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/meal-planning-assistant',
    averageRating: 4.5,
    ratingCount: 27
  },
  {
    title: 'Legal Document Simplifier',
    userId: 'user_expert_1',
    category: 'Other',
    promptText: `Explain the legal document or clause I provide in plain language while preserving its actual meaning. Identify the parties, obligations, deadlines, permissions, risks, exceptions, and terms that deserve professional review. Quote or reference the relevant section when possible, distinguish explanation from legal advice, and never infer jurisdiction-specific conclusions that the text or context does not support.`,
    description: 'Makes legal language easier to understand while clearly separating explanation from legal advice.',
    tags: ['legal', 'documents', 'plain-language', 'review'],
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/legal-document-simplifier',
    averageRating: 4.1,
    ratingCount: 14
  },
  {
    title: 'Presentation Outline Builder',
    userId: 'user_writer_4',
    category: 'Other',
    promptText: `Build a persuasive presentation outline from the audience, objective, evidence, time limit, and decision needed. Create a clear narrative arc, give each slide one job, recommend concise visual content, and mark where data or examples are required. Include opening and closing language, speaker-note prompts, and a final check for unsupported claims or overloaded slides.`,
    description: 'Creates focused presentation narratives with slide purpose, visuals, evidence needs, and speaker notes.',
    tags: ['presentation', 'storytelling', 'communication', 'design'],
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/presentation-outline-builder',
    averageRating: 4.4,
    ratingCount: 25
  },
  {
    title: 'Professional LinkedIn Photo',
    userId: 'user_writer_4',
    category: 'AI Image / Photo Editing',
    promptText: `Edit the uploaded reference photo into a polished professional LinkedIn portrait while preserving my facial structure, recognizable features, natural skin texture, and hairstyle. Use a softly lit neutral studio background, flattering eye-level composition from the shoulders up, business-appropriate wardrobe, and subtle color correction. Keep the expression natural, remove only temporary distractions, and export a clean 1:1 or 4:5 professional headshot.`,
    description: 'Creates a credible professional profile portrait while preserving natural identity and texture.',
    tags: ['ai-image', 'linkedin', 'portrait', 'career'],
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/professional-linkedin-photo',
    averageRating: 4.8,
    ratingCount: 37
  },
  {
    title: 'Cinematic Portrait Generator',
    userId: 'user_expert_1',
    category: 'AI Image / Photo Editing',
    promptText: `Transform the uploaded portrait into a cinematic editorial image while preserving the subject's facial structure, recognizable features, natural skin texture, and identity. Place the subject in a believable environment that matches the mood I specify, use motivated key lighting with controlled shadows, and frame the image with intentional depth of field. Keep wardrobe realistic and export a 2:3 portrait composition with no text or artificial facial changes.`,
    description: 'Turns a reference portrait into a believable cinematic editorial scene without losing identity.',
    tags: ['ai-image', 'portrait', 'cinematic', 'photography'],
    imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/cinematic-portrait-generator',
    averageRating: 4.7,
    ratingCount: 42
  },
  {
    title: 'AI Action Figure Creator',
    userId: 'user_student_3',
    category: 'AI Image / Photo Editing',
    promptText: `Use the uploaded reference image to design a collectible action figure inspired by the subject, while keeping recognizable facial features and hairstyle when visible. Place the figure in a clear retail blister package with accessories that reflect the supplied role or hobbies, readable but fictional packaging, studio product lighting, and realistic molded materials. Use a centered 4:5 composition and avoid copying real brands, logos, or copyrighted characters.`,
    description: 'Creates a personalized collectible figure concept with coherent accessories and product packaging.',
    tags: ['ai-image', 'action-figure', 'toy-design', 'creative'],
    imageUrl: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/ai-action-figure-creator',
    averageRating: 4.5,
    ratingCount: 26
  },
  {
    title: 'Outfit Transformation',
    userId: 'user_writer_4',
    category: 'AI Image / Photo Editing',
    promptText: `Edit the uploaded photo to show the outfit I describe while preserving my face, body proportions, pose, natural skin texture, and recognizable hairstyle. Make the clothing fit the existing perspective and lighting, include realistic folds and shadows, and keep the setting unchanged unless I request a compatible adjustment. Present the result as a clean full-body or three-quarter fashion photograph in a 4:5 aspect ratio.`,
    description: 'Visualizes a requested wardrobe change with realistic fit, lighting, and identity preservation.',
    tags: ['ai-image', 'fashion', 'outfit', 'photo-editing'],
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/outfit-transformation',
    averageRating: 4.4,
    ratingCount: 21
  },
  {
    title: 'Background Replacement',
    userId: 'user_expert_1',
    category: 'AI Image / Photo Editing',
    promptText: `Replace the background of the uploaded subject photo with the location and atmosphere I specify, keeping the person's facial structure, hair edges, body position, clothing, and natural texture intact. Match perspective, horizon, color temperature, contact shadows, and depth of field so the subject belongs in the scene. Remove distracting background objects carefully and export a realistic 4:5 composition without halos or added text.`,
    description: 'Places an existing subject into a new believable environment with matched perspective and lighting.',
    tags: ['ai-image', 'background', 'photo-editing', 'compositing'],
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/background-replacement',
    averageRating: 4.6,
    ratingCount: 34
  },
  {
    title: 'Old Photo Restoration',
    userId: 'user_student_3',
    category: 'AI Image / Photo Editing',
    promptText: `Restore the uploaded old photograph while preserving the people, facial structure, expressions, clothing, and historical character. Repair scratches, tears, dust, fading, and uneven exposure conservatively; reconstruct missing areas only when the surrounding evidence supports it. Offer a faithful black-and-white restoration first, then an optional restrained colorized version, both with natural texture and a high-resolution 4:3 export.`,
    description: 'Restores damaged family photographs conservatively while protecting historical details and expressions.',
    tags: ['ai-image', 'restoration', 'photography', 'archival'],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/old-photo-restoration',
    averageRating: 4.9,
    ratingCount: 48
  },
  {
    title: 'Polaroid Photo Transformation',
    userId: 'user_writer_4',
    category: 'AI Image / Photo Editing',
    promptText: `Transform the uploaded image into a believable instant-film photograph while preserving the subject's identity and the important details of the original scene. Add soft flash falloff, subtle film grain, gentle color shifts, authentic white framing, and slight exposure variation without excessive blur or artificial nostalgia. Compose the final image as a vertical 3:4 print with a caption only if I provide the exact words.`,
    description: 'Gives a photo authentic instant-film character without obscuring the original subject or scene.',
    tags: ['ai-image', 'polaroid', 'film', 'nostalgia'],
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=801&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/polaroid-photo-transformation',
    averageRating: 4.3,
    ratingCount: 19
  },
  {
    title: 'Studio Photography Upgrade',
    userId: 'user_expert_1',
    category: 'AI Image / Photo Editing',
    promptText: `Upgrade the uploaded product or personal photo into a controlled studio photograph without changing the object's shape, proportions, branding, or identifying details. Use a clean backdrop, softbox key light, gentle fill, grounded contact shadow, and a lens perspective appropriate to the subject. Remove dust and distracting reflections only, then provide centered 1:1 and wider 4:5 versions with accurate colors.`,
    description: 'Creates a clean studio-style image while preserving product accuracy, color, and proportions.',
    tags: ['ai-image', 'studio', 'product-photo', 'lighting'],
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/studio-photography-upgrade',
    averageRating: 4.6,
    ratingCount: 31
  },
  {
    title: 'Travel Photo Enhancement',
    userId: 'user_student_3',
    category: 'AI Image / Photo Editing',
    promptText: `Enhance the uploaded travel photograph while preserving the real location, people, architecture, and recognizable details. Correct exposure, white balance, haze, and distracting temporary objects with a natural documentary touch; do not invent landmarks, alter faces, or oversaturate the sky. Improve depth and composition through restrained cropping, and export a landscape 3:2 version suitable for a photo journal.`,
    description: 'Improves travel photos with restrained documentary editing that keeps the place authentic.',
    tags: ['ai-image', 'travel', 'photo-editing', 'enhancement'],
    imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/travel-photo-enhancement',
    averageRating: 4.5,
    ratingCount: 23
  },
  {
    title: 'Anime / Illustration Transformation',
    userId: 'user_writer_4',
    category: 'AI Image / Photo Editing',
    promptText: `Transform the uploaded reference image into an original anime-inspired illustration while preserving the subject's recognizable facial structure, hairstyle, pose, and key clothing details. Choose a coherent palette, expressive but believable lighting, and a clean background suited to the requested mood. Use original visual decisions rather than imitating a living artist, and deliver a polished vertical 2:3 composition with clear linework.`,
    description: 'Creates an original anime-inspired portrait while retaining the reference subject and pose.',
    tags: ['ai-image', 'anime', 'illustration', 'portrait'],
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=800&auto=format&fit=crop&q=80',
    prototypeUrl: 'https://example.com/anime-illustration-transformation',
    averageRating: 4.2,
    ratingCount: 29
  },
  {
    title: 'Instagram Caption Generator', userId: 'user_writer_4', category: 'Instagram / Social Media',
    promptText: `Write Instagram captions for the niche, post context, audience, goal, and tone I provide. Give three options: concise and conversational, story-led, and conversion-focused. Open with a natural hook, avoid unsupported claims and generic engagement bait, include a clear call to action when appropriate, and keep emojis and hashtags restrained. Explain the audience response each option is designed to encourage.`,
    description: 'Produces varied Instagram captions tailored to audience, tone, content goal, and platform context.',
    tags: ['instagram', 'caption', 'social-media', 'content'], imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-caption-generator', averageRating: 4.6, ratingCount: 45
  },
  {
    title: 'Instagram Reel Hook Generator', userId: 'user_writer_4', category: 'Instagram / Social Media',
    promptText: `Generate ten original opening hooks for an Instagram Reel about the topic, niche, audience, and desired action I provide. Mix curiosity, clear value, relatable tension, myth correction, and direct problem statements. Keep each hook speakable in the first two seconds, avoid exaggerated promises, and label the visual or on-screen cue that should accompany each one.`,
    description: 'Creates short, speakable Reel openings with varied attention strategies and visual cues.',
    tags: ['instagram', 'reels', 'hooks', 'social-media'], imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-reel-hook-generator', averageRating: 4.7, ratingCount: 51
  },
  {
    title: 'Instagram Reel Script Writer', userId: 'user_expert_1', category: 'Instagram / Social Media',
    promptText: `Write a practical Instagram Reel script for the topic, audience, duration, creator voice, and content goal I provide. Structure the first-second hook, spoken lines, on-screen text, b-roll or shot directions, transition points, and closing call to action. Keep the pacing realistic for the duration, use specific examples, and flag any claim that requires evidence before publishing.`,
    description: 'Turns a Reel idea into a timed script with spoken lines, shots, text overlays, and CTA.',
    tags: ['instagram', 'reels', 'script', 'content'], imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-reel-script-writer', averageRating: 4.8, ratingCount: 38
  },
  {
    title: 'Instagram Story Engagement Generator', userId: 'user_student_3', category: 'Instagram / Social Media',
    promptText: `Design a one-day Instagram Story sequence for my niche, audience, topic, and goal. Plan five to seven frames with a clear narrative, useful visual suggestions, and interactive elements such as a poll, question, quiz, or slider. Make the interaction meaningful rather than decorative, include accessible text guidance, and end with a low-friction next step.`,
    description: 'Plans interactive Story sequences that build context, invite useful replies, and guide a next action.',
    tags: ['instagram', 'stories', 'engagement', 'social-media'], imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-story-engagement', averageRating: 4.4, ratingCount: 22
  },
  {
    title: 'Instagram Carousel Generator', userId: 'user_writer_4', category: 'Instagram / Social Media',
    promptText: `Create an Instagram carousel about the subject, audience, and outcome I provide. Map a strong first-slide promise, one clear idea per slide, concise copy, visual direction, and a final save-or-share call to action. Keep the sequence useful when skimmed, avoid overcrowded text, suggest accessible contrast and alt text, and separate evidence from opinion.`,
    description: 'Builds skimmable educational carousels with slide-level copy, visuals, accessibility, and CTA.',
    tags: ['instagram', 'carousel', 'design', 'content'], imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-carousel-generator', averageRating: 4.5, ratingCount: 34
  },
  {
    title: 'Personal Brand Content Planner', userId: 'user_expert_1', category: 'Instagram / Social Media',
    promptText: `Build a four-week personal brand content plan from my expertise, audience, boundaries, platforms, available time, and business goal. Define three to five content pillars, a realistic posting cadence, weekly ideas across formats, and a simple repurposing workflow. Keep the voice human, avoid pretending to have experiences I did not provide, and include a review loop based on useful audience signals.`,
    description: 'Creates a sustainable personal-brand plan around expertise, boundaries, time, and audience signals.',
    tags: ['instagram', 'personal-brand', 'content', 'strategy'], imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/personal-brand-content-planner', averageRating: 4.7, ratingCount: 40
  },
  {
    title: 'Viral Content Idea Generator', userId: 'user_writer_4', category: 'Instagram / Social Media',
    promptText: `Generate fifteen original content ideas for my niche, audience, platform, resources, and goal. Balance timely conversation with evergreen usefulness, and for each idea provide the audience tension, format, opening hook, proof or example needed, production effort, and responsible CTA. Do not promise virality, copy trending creators, or recommend misleading outrage; prioritize ideas worth sharing because they help people.`,
    description: 'Develops original shareable content ideas while keeping quality, effort, evidence, and ethics visible.',
    tags: ['instagram', 'social-media', 'content-ideas', 'strategy'], imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/viral-content-ideas', averageRating: 4.3, ratingCount: 18
  },
  {
    title: 'Hashtag / Keyword Strategy Assistant', userId: 'user_dev_2', category: 'Instagram / Social Media',
    promptText: `Create an Instagram discovery strategy for my niche, audience, content topic, region, and goal. Suggest a balanced set of specific keywords, spoken terms, caption phrases, and hashtag themes rather than a generic list. Explain the search intent behind each group, show how to place them naturally, and include a testing plan using actual reach and saves instead of guaranteed-growth claims.`,
    description: 'Builds practical Instagram search language and testing groups instead of generic hashtag lists.',
    tags: ['instagram', 'hashtags', 'keywords', 'discoverability'], imageUrl: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/instagram-keyword-strategy', averageRating: 4.2, ratingCount: 16
  },
  {
    title: 'Resume Tailor', userId: 'user_student_3', category: 'Career / Jobs',
    promptText: `Tailor my existing resume to the job description and target role I provide. Map requirements to evidence already present in my experience, identify missing information separately, and rewrite only bullets that can be supported. Preserve truthful scope and chronology, avoid keyword stuffing, and finish with a change log, ATS keyword checklist, and questions I should answer before submitting.`,
    description: 'Aligns a real resume to a target job while clearly separating evidence, gaps, and assumptions.',
    tags: ['career', 'resume', 'job-search', 'ats'], imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/resume-tailor', averageRating: 4.8, ratingCount: 53
  },
  {
    title: 'Job Description Analyzer', userId: 'user_expert_1', category: 'Career / Jobs',
    promptText: `Analyze the job description I provide and translate it into a candidate preparation brief. Separate required skills, preferred skills, responsibilities, outcomes, seniority signals, interview clues, and possible red flags. Distinguish explicit requirements from reasonable inferences, suggest evidence I should prepare from my actual experience, and identify questions to ask the employer before deciding whether to apply.`,
    description: 'Decodes job descriptions into evidence to prepare, questions to ask, and realistic fit signals.',
    tags: ['career', 'job-search', 'analysis', 'interview'], imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/job-description-analyzer', averageRating: 4.6, ratingCount: 36
  },
  {
    title: 'Interview Simulator', userId: 'user_dev_2', category: 'Career / Jobs',
    promptText: `Run an interactive interview simulation for the role, company context, seniority, and interview type I provide. Ask one question at a time, wait for my response, and follow up when my reasoning needs clarification. Score evidence, structure, technical accuracy, and communication separately, then give concise feedback and a stronger outline without inventing experience or pretending the score predicts a real hiring decision.`,
    description: 'Simulates realistic interviews with adaptive follow-ups, separate scoring, and honest feedback.',
    tags: ['career', 'interview', 'practice', 'coaching'], imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/interview-simulator', averageRating: 4.9, ratingCount: 61
  },
  {
    title: 'Salary Negotiation Practice', userId: 'user_writer_4', category: 'Career / Jobs',
    promptText: `Role-play a respectful salary negotiation using the offer, role scope, location, market information, constraints, and priorities I provide. Take the employer side first, ask realistic questions, and let me practice a response before giving feedback. Help me frame value with evidence from my actual experience, prepare trade-offs beyond base salary, and flag claims or market numbers that need verification.`,
    description: 'Provides realistic negotiation practice grounded in actual value, priorities, and verifiable evidence.',
    tags: ['career', 'salary', 'negotiation', 'jobs'], imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/salary-negotiation-practice', averageRating: 4.5, ratingCount: 28
  },
  {
    title: 'Job Application Cover Letter', userId: 'user_writer_4', category: 'Career / Jobs',
    promptText: `Draft a concise cover letter from my resume, job description, company context, and motivation. Connect two or three verified experiences to the employer's stated needs, use a specific opening, and make the next step clear. Do not invent achievements, enthusiasm, or company research; mark missing evidence and provide a version that sounds human rather than templated.`,
    description: 'Writes evidence-based cover letters that connect real experience to a specific employer need.',
    tags: ['career', 'cover-letter', 'job-search', 'writing'], imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/job-application-cover-letter', averageRating: 4.4, ratingCount: 24
  },
  {
    title: 'Portfolio Project Evaluator', userId: 'user_expert_1', category: 'Career / Jobs',
    promptText: `Evaluate my portfolio project for the target role and audience I provide. Review problem framing, contribution, technical or design decisions, evidence of outcome, visual explanation, and writing clarity. Separate what the case study proves from what it merely claims, recommend the three highest-impact revisions, and suggest interview questions the project should prepare me to answer.`,
    description: 'Improves portfolio case studies by testing clarity, evidence, contribution, and role relevance.',
    tags: ['career', 'portfolio', 'case-study', 'job-search'], imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/portfolio-project-evaluator', averageRating: 4.7, ratingCount: 32
  },
  {
    title: 'Learn Any Topic From Zero', userId: 'user_student_3', category: 'Education / Learning',
    promptText: `Teach me the topic I name as a complete beginner using an adaptive sequence. First ask what I already know, why I need the topic, and how much time I have; then introduce a simple mental model, one example, and a short check for understanding. Increase difficulty only after my response, correct misconceptions, and finish each session with retrieval questions and a practical mini-task.`,
    description: 'Builds a personalized beginner-to-practical learning path through questions and retrieval practice.',
    tags: ['education', 'learning', 'beginner', 'study'], imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/learn-any-topic', averageRating: 4.8, ratingCount: 49
  },
  {
    title: 'Socratic Tutor', userId: 'user_expert_1', category: 'Education / Learning',
    promptText: `Act as a Socratic tutor for the problem or concept I provide. Do not reveal the full solution immediately; ask one purposeful question that helps me inspect an assumption or next step. Respond to my answer by identifying the reasoning gap, offering a hint or counterexample, and checking my revised explanation until I can state the principle and apply it to a new example.`,
    description: 'Guides learners toward their own understanding through targeted questions, hints, and transfer checks.',
    tags: ['education', 'socratic', 'tutoring', 'learning'], imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/socratic-tutor', averageRating: 4.7, ratingCount: 43
  },
  {
    title: 'Active Recall Quiz Generator', userId: 'user_student_3', category: 'Education / Learning',
    promptText: `Create an adaptive active-recall quiz from the notes or source I provide. Start with foundational, application, and misconception questions, ask one at a time, and wait for my answer before revealing feedback. Track weak concepts within the session, adjust difficulty accordingly, explain why an answer is right, and finish with a spaced-review queue rather than only a score.`,
    description: 'Runs an adaptive retrieval quiz that tracks weak concepts and creates a follow-up review queue.',
    tags: ['education', 'quiz', 'active-recall', 'study'], imageUrl: 'https://images.unsplash.com/photo-1453738773917-9c3eff1db985?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/active-recall-quiz', averageRating: 4.6, ratingCount: 35
  },
  {
    title: 'Study Notes Generator', userId: 'user_writer_4', category: 'Education / Learning',
    promptText: `Convert the lecture, chapter, or transcript I provide into study notes for the stated level and exam goal. Preserve definitions, mechanisms, examples, and uncertainty, organize related ideas hierarchically, and mark claims that need checking. Add a short summary, comparison table where useful, likely misconceptions, five retrieval questions, and a glossary without turning every sentence into a heading.`,
    description: 'Transforms dense learning material into structured, checkable notes with retrieval questions.',
    tags: ['education', 'notes', 'study', 'learning'], imageUrl: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/study-notes-generator', averageRating: 4.5, ratingCount: 27
  },
  {
    title: 'Adaptive Exam Revision Planner', userId: 'user_student_3', category: 'Education / Learning',
    promptText: `Create an adaptive exam revision plan from my subjects, dates, confidence ratings, available study blocks, and existing commitments. Prioritize weak and high-value topics, mix retrieval practice with worked examples, schedule spaced reviews and timed papers, and include recovery time. Add a weekly diagnostic checkpoint that changes the plan based on demonstrated performance rather than planned hours alone.`,
    description: 'Builds an evidence-responsive revision schedule around dates, confidence, capacity, and performance.',
    tags: ['education', 'exam', 'revision', 'planning'], imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/adaptive-exam-revision', averageRating: 4.4, ratingCount: 30
  },
  {
    title: 'Mistake Prevention Coach', userId: 'user_expert_1', category: 'Education / Learning',
    promptText: `Review the recurring mistakes, worked solutions, or practice answers I provide. Classify each error by misconception, attention slip, procedure, interpretation, or knowledge gap, then ask a diagnostic question before suggesting a fix. Create a personal error checklist, one similar problem, and a delayed retrieval task so I practice preventing the mistake rather than memorizing the correction.`,
    description: 'Turns recurring learning mistakes into diagnostic checks, prevention habits, and targeted practice.',
    tags: ['education', 'mistakes', 'practice', 'learning'], imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/mistake-prevention-coach', averageRating: 4.8, ratingCount: 41
  },
  {
    title: 'Code Debugger', userId: 'user_dev_2', category: 'Coding / Development',
    promptText: `Debug the code, error output, expected behavior, environment, and smallest reproduction I provide. Start with confirmed observations, separate hypotheses from evidence, rank likely root causes, and propose the smallest focused change. Explain how to reproduce and verify the fix, include a regression test when appropriate, and avoid unrelated rewrites or claims about code that was not shown.`,
    description: 'Provides evidence-led debugging with a minimal fix, reproduction steps, and regression coverage.',
    tags: ['coding', 'debugging', 'testing', 'programming'], imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/code-debugger', averageRating: 4.9, ratingCount: 68
  },
  {
    title: 'SQL Query Debugger', userId: 'user_dev_2', category: 'Coding / Development',
    promptText: `Diagnose the SQL query, schema, sample rows, error message, and intended result I provide. Determine whether the problem is syntax, joins, filtering, aggregation, null handling, or data assumptions, and show a corrected query with a small before-and-after example. Explain the root cause, warn about duplicate rows or changed semantics, and suggest a regression query for future changes.`,
    description: 'Finds SQL correctness bugs with data examples, semantic warnings, and regression queries.',
    tags: ['coding', 'sql', 'debugging', 'databases'], imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/sql-query-debugger', averageRating: 4.7, ratingCount: 46
  },
  {
    title: 'Code Reviewer', userId: 'user_expert_1', category: 'Coding / Development',
    promptText: `Review the diff, surrounding code, requirements, and test evidence I provide as a careful senior engineer. Report findings first, ordered by severity, with concrete behavior references. Focus on correctness, security, maintainability, performance, and missing tests; distinguish definite defects from questions, avoid style nitpicks unless they hide risk, and suggest the smallest safe fix for each important finding.`,
    description: 'Delivers risk-focused code review findings with severity, evidence, fixes, and test gaps.',
    tags: ['coding', 'code-review', 'quality', 'testing'], imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/code-reviewer', averageRating: 4.8, ratingCount: 57
  },
  {
    title: 'Git Commit & PR Assistant', userId: 'user_dev_2', category: 'Coding / Development',
    promptText: `Use the actual diff, issue, and test results I provide to prepare a conventional commit and concise pull request. Summarize user-visible behavior, implementation choices, migration concerns, and verified tests; list limitations separately. Do not invent work, claim a test passed without evidence, or hide a breaking change. Include a reviewer checklist for the highest-risk paths.`,
    description: 'Creates truthful commits and pull requests from real diffs, evidence, risks, and limitations.',
    tags: ['coding', 'git', 'pull-request', 'collaboration'], imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/git-commit-pr-assistant', averageRating: 4.6, ratingCount: 33
  },
  {
    title: 'API Documentation Generator', userId: 'user_writer_4', category: 'Coding / Development',
    promptText: `Generate API documentation from the routes, schemas, authentication behavior, examples, and errors I provide. Document each endpoint's purpose, method, parameters, request and response shapes, status codes, and realistic curl examples. Mark observed behavior separately from recommendations, never invent fields, and end with an OpenAPI coverage checklist and tests needed to keep documentation accurate.`,
    description: 'Documents real API contracts with examples, status behavior, explicit uncertainty, and coverage checks.',
    tags: ['coding', 'api', 'documentation', 'openapi'], imageUrl: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/api-documentation-generator-development', averageRating: 4.7, ratingCount: 44
  },
  {
    title: 'Weekly Planner', userId: 'user_student_3', category: 'Productivity / Personal',
    promptText: `Build a realistic weekly plan from my commitments, priorities, deadlines, energy patterns, available hours, and constraints. Separate must-do outcomes from optional tasks, account for dependencies and transition time, protect recovery, and schedule the first concrete action for each priority. Include a daily reset and weekly review that adjusts capacity instead of rewarding overcommitment.`,
    description: 'Creates a capacity-aware weekly plan that respects priorities, dependencies, energy, and recovery.',
    tags: ['productivity', 'planning', 'priorities', 'workflow'], imageUrl: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/weekly-planner', averageRating: 4.6, ratingCount: 48
  },
  {
    title: 'Decision-Making Assistant', userId: 'user_expert_1', category: 'Productivity / Personal',
    promptText: `Help me make a decision using the options, goal, constraints, time horizon, values, and evidence I provide. Clarify what is reversible, identify missing information, compare meaningful criteria with explicit weights, and show the strongest argument for each option. Recommend a next step only after stating assumptions, risks, and a simple way to review whether the decision worked.`,
    description: 'Structures difficult decisions around criteria, reversibility, evidence, assumptions, and review points.',
    tags: ['productivity', 'decisions', 'planning', 'priorities'], imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/decision-making-assistant', averageRating: 4.5, ratingCount: 29
  },
  {
    title: 'Habit Builder', userId: 'user_student_3', category: 'Productivity / Personal',
    promptText: `Help me build one sustainable habit around my goal, schedule, environment, motivation, and likely obstacles. Convert the goal into a small observable behavior, attach it to a reliable cue, define a minimum version, and plan for missed days. Suggest a low-friction tracking method and weekly review using evidence without shame, streak obsession, or unrealistic lifestyle changes.`,
    description: 'Designs sustainable habits with cues, minimum actions, tracking, and compassionate recovery plans.',
    tags: ['productivity', 'habits', 'goals', 'wellbeing'], imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=802&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/habit-builder', averageRating: 4.4, ratingCount: 35
  },
  {
    title: 'Meeting Notes to Action Items', userId: 'user_writer_4', category: 'Productivity / Personal',
    promptText: `Turn the meeting notes or transcript I provide into a trustworthy action record. Separate decisions, action items, owners, dates, risks, unresolved questions, and discussion context. Assign ownership or deadlines only when stated, flag contradictions and missing commitments, and produce a follow-up message that confirms what was agreed without converting speculation into a decision.`,
    description: 'Converts messy meeting notes into verified decisions, owners, actions, risks, and open questions.',
    tags: ['productivity', 'meetings', 'action-items', 'organization'], imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=801&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/meeting-notes-action-items', averageRating: 4.8, ratingCount: 52
  },
  {
    title: 'Personal Goal Breakdown', userId: 'user_student_3', category: 'Productivity / Personal',
    promptText: `Break my personal goal into milestones and next actions using the deadline, available time, resources, constraints, and definition of success I provide. Identify dependencies, choose a realistic weekly pace, and define a small first step that can happen today. Include checkpoints, likely obstacles, and a reset plan for when the original schedule no longer fits.`,
    description: 'Turns an ambitious personal goal into a realistic path of milestones, dependencies, and next actions.',
    tags: ['productivity', 'goals', 'planning', 'organization'], imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80', prototypeUrl: 'https://example.com/personal-goal-breakdown', averageRating: 4.3, ratingCount: 24
  }
];

const existingTitles = new Set(db.getPrompts().map(prompt => prompt.title));
const allSeedPrompts = [...seedPrompts, ...researchPrompts];
const insertedByCategory = new Map<string, number>();
let inserted = 0;

for (const seedPrompt of allSeedPrompts) {
  if (existingTitles.has(seedPrompt.title)) continue;

  if (!db.findUserById(seedPrompt.userId)) {
    throw new Error(`Cannot seed "${seedPrompt.title}": author ${seedPrompt.userId} does not exist.`);
  }

  const created = db.createPrompt({
    userId: seedPrompt.userId,
    title: seedPrompt.title,
    promptText: seedPrompt.promptText,
    description: seedPrompt.description,
    tags: seedPrompt.tags,
    category: seedPrompt.category,
    media: [{ type: 'image', url: seedPrompt.imageUrl }],
    prototypeUrl: seedPrompt.prototypeUrl
  });

  db.updatePrompt(created._id, {
    averageRating: seedPrompt.averageRating,
    ratingCount: seedPrompt.ratingCount
  });

  existingTitles.add(seedPrompt.title);
  inserted += 1;
  insertedByCategory.set(seedPrompt.category, (insertedByCategory.get(seedPrompt.category) || 0) + 1);
}

console.log(`Seed complete. Inserted ${inserted} prompt${inserted === 1 ? '' : 's'}.`);
console.log(`Category counts: ${Array.from(insertedByCategory.entries()).map(([category, count]) => `${category}=${count}`).join(', ') || 'no new prompts'}.`);
console.log('Database file: .data/db.json');
