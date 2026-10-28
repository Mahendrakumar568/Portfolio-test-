// Writes the starter content in /content. Run once: node scripts/seed.mjs
import { mkdirSync, writeFileSync } from "fs";
import { randomUUID } from "crypto";

const now = new Date().toISOString();
const M = "https://medium.com/@jithendrasaikilaru/";
const D = "https://dev.to/jithendrasai_kilaru_1a67a/";

const settings = {
  headline: "Ideas become outcomes.",
  thesis:
    "I work where technology meets business strategy, studying how ideas turn into practical solutions and what it takes to carry them all the way to outcomes.",
  bio:
    "Jithendra Sai Kilaru works where technology meets business. A computer science graduate of SRM University AP, he works in the Founder's Office at openCT, running operations and supporting the founder on outreach and timelines. Before that he spent his university years inside startups and SRM's innovation and entrepreneurship programs, in operations, data and people roles. Every week he writes Rising Ideas, analysis of technology, business and geopolitics for more than 900 subscribers.",
  portrait: "/images/portrait-smile.jpg",
  location: "Khammam, Telangana, India",
  email: "",
  linkedinUrl: "https://www.linkedin.com/in/jithendrasaikilaru/",
  newsletterUrl: "https://www.linkedin.com/in/jithendrasaikilaru/",
  mediumUrl: "https://medium.com/@jithendrasaikilaru",
  subscribers: 917,
  editions: 84,
  signal: {
    mode: "off",
    message: "Taking new conversations on operations and strategy.",
    ctaLabel: "Start a conversation",
    endsOn: "",
  },
  stealth: {
    revealed: false,
    sector: "Healthcare",
    teaser: "Something precious is being cut. More when it's ready.",
    name: "",
    summary: "",
    url: "",
  },
  updatedAt: now,
};

const essays = [
  ["2026-08-07", "Putin in Delhi: India's Master Move in Global Chess", "Geopolitics", true, M + "putin-in-delhi-indias-master-move-in-global-chess-13656b7bd22a",
    "Energy, nuclear, LNG and defence deals give India room to absorb pressure from US tariffs, and show a country that will not be cornered into choosing between powers.",
    "India will not be cornered into choosing between powers."],
  ["2026-08-06", "Bharath's Sharp AI Insight: One Solution, Three Wins", "Technology", false, M + "bharaths-sharp-ai-insight-one-solution-three-wins-57f948c85bf1",
    "An MP used ChatGPT to brainstorm fixes for Vizag's beach road, leading to AI speed and crime cameras. A small case for AI as augmentation rather than replacement.",
    "It is not about replacement, it is about augmentation."],
  ["2026-08-05", "From Groceries to Land: What Zepto's \"10-Minute Real Estate\" Tells Us About Solution Generation", "Startups", true, M + "from-groceries-to-land-what-zeptos-10-minute-real-estate-tells-us-about-solution-generation-3dde3c3d18a8",
    "Can a speed-first model built for groceries work for a purchase as high-stakes as land? A stress test of Zepto's move, and what it teaches about carrying a solution into the market nobody expects.",
    "Speed works beautifully for low-value, high-frequency needs."],
  ["2026-08-04", "Learning by Living: How Attitude, Experience & Real Learning Outshine Theory", "Business", false, M + "learning-by-living-how-attitude-experience-real-learning-outshine-theory-c8b0c2a09224",
    "Attitude, experience and education each matter, and none of them guarantees success alone.",
    "Attitude doesn't replace skill. But without it, even the best skills can crash."],
  ["2026-08-03", "Bridging the Real Gap: Professional Development, Education, and Mentorship in the Real World", "Business", false, M + "bridging-the-real-gap-professional-development-education-and-mentorship-in-the-real-world-6c9378948ec1",
    "Goal-setting, schooling and mentorship all fail in the same way: when they turn into box-ticking.",
    "Education without real-world application is knowledge without muscle."],
  ["2026-08-02", "Unpacking Trump's 25% Tariffs & \"Dead Economy\" Claims: A Strategic Crossroads for India and Russia", "Geopolitics", true, M + "unpacking-trumps-25-tariffs-dead-economy-claims-a-strategic-crossroads-for-india-russia-98bd230aa77a",
    "Which Indian sectors are exposed, and why India's answer has been diplomatic rather than retaliatory.",
    "Tariffs are not simply taxes, they are tools of influence."],
  ["2026-08-01", "The Value-Vanity Dilemma: What LinkedIn Is Becoming", "Business", false, M + "the-value-vanity-dilemma-what-linkedin-is-becoming-3afad5543b95",
    "Recycled AI content and engagement bait are crowding LinkedIn. The answer is to curate deliberately, as a reader and as a writer.",
    ""],
  ["2026-08-01", "How a Simple Idea Is Transforming an Entire Industry, and What We Can Learn From It", "Startups", false, M + "how-a-simple-idea-is-transforming-an-entire-industry-and-what-we-can-learn-from-it-ba1a1f35d212",
    "Phia, from Phoebe Gates and Sophia Kianni, applies a plain aggregation idea to secondhand fashion, and shows how far precision can carry simplicity.",
    "Simplicity, applied with precision, is often the most powerful form of innovation."],
  ["2026-07-30", "The Protest Didn't Change Politics. It Changed How India Communicates.", "Geopolitics", true, M + "the-protest-didnt-change-politics-it-changed-how-india-communicates-eaf82e1ba757",
    "Influence has moved to Instagram and YouTube. The essay proposes rapid-response units and platform accountability for a country where narratives move faster than facts.",
    "Narratives often travel farther than verified facts."],
  ["2026-07-30", "The Founder's Mindset: Thinking Beyond Limits", "Startups", true, M + "the-founders-mindset-thinking-beyond-limits-b445dff3723e",
    "Vision, resilience, strategy and execution: eight principles of how founders think.",
    ""],
  ["2025-10-31", "WAND and Block-Max WAND: Efficient Algorithms for Top-k Document Retrieval", "Technology", true, M + "wand-and-block-max-wand-efficient-algorithms-for-top-k-document-retrieval-5dfca4b84499",
    "A paper-style explainer of how search engines find the top results without scoring every document.",
    ""],
  ["2025-04-04", "SQL Fundamentals for Beginners", "Technology", false, D + "sql-fundamentals-for-beginners-45bc",
    "A plain-language first tour of SQL.", ""],
  ["2025-03-21", "Optimizing Search Algorithms for Large Data Sets: Binary Search vs. Hashing", "Technology", false, D + "optimizing-search-algorithms-for-large-data-sets-a-comparative-study-of-binary-search-vs-hashing-4p78",
    "A comparative study of two search strategies and when each wins on large data sets.", ""],
  ["2025-03-16", "A Comprehensive Guide to AES Encryption in Python", "Technology", false, D + "a-comprehensive-guide-to-aes-encryption-in-python-3i5l",
    "How AES works and how to use it correctly from Python.", ""],
  ["2025-03-13", "AI Chatbots Are Now Speaking Their Own Language", "Technology", false, D + "ai-chat-bots-are-now-speaking-their-own-language-is-this-the-future-or-a-nightmare-59c1",
    "GibberLink lets AI agents talk to each other in beeps. Efficiency against transparency and oversight.",
    "The goal of AI should be to augment human capabilities, not operate in the shadows."],
];

const slugify = (t) => t.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[\s_-]+/g, "-").slice(0, 80).replace(/-+$/, "");

mkdirSync("content/posts", { recursive: true });
writeFileSync("content/settings.json", JSON.stringify(settings, null, 2) + "\n");

for (const [date, title, topic, featured, url, excerpt, quote] of essays) {
  const id = randomUUID();
  const post = {
    id, slug: slugify(title), kind: "essay", title, date, topic, excerpt, body: "",
    pullQuote: quote || undefined,
    externalUrl: url, externalLabel: url.includes("dev.to") ? "DEV" : "Medium",
    featured, published: true, updatedAt: now,
  };
  writeFileSync(`content/posts/${id}.json`, JSON.stringify(post, null, 2) + "\n");
}

// One unpublished example edition so the admin panel shows the shape of an edition.
const exampleId = randomUUID();
writeFileSync(`content/posts/${exampleId}.json`, JSON.stringify({
  id: exampleId, slug: "example-edition", kind: "edition", editionNumber: 85,
  title: "Example edition: replace me", date: now.slice(0, 10), topic: "Business",
  excerpt: "A draft that shows how an edition looks. Edit it or delete it.",
  body: "Write or paste the edition here. Markdown works: **bold**, *italic*, [links](https://example.com), lists and quotes.\n\n> A pull quote looks like this.",
  externalUrl: "", externalLabel: "LinkedIn", featured: false, published: false, updatedAt: now,
}, null, 2) + "\n");

console.log(`Seeded settings and ${essays.length + 1} posts.`);
