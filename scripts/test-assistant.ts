import { answerQuestion } from "../src/lib/heritage-assistant";

console.log("=================================================");
console.log("TESTING AI ASSISTANT (BHARTI) - SIH26197");
console.log("=================================================\n");

const tests = [
  { name: "Test 0: Casual Greeting ('hii')", query: "hii" },
  { name: "Test 0B: Regional Greeting ('namaste')", query: "namaste" },
  { name: "Test 0C: Polite Greeting ('good morning')", query: "good morning" },
  { name: "Test A: Known heritage term", query: "Brihadisvara Temple" },
  { name: "Test B: Alternate spelling", query: "Brihadeeswarar" },
  { name: "Test C: Regional / local term", query: "Korvai" },
  { name: "Test D: Completely unknown term (The 'Bhartilow' Case)", query: "Bhartilow" },
  { name: "Test E: Ambiguous term", query: "Sun Temple" },
  { name: "Test F: False / fabricated claim", query: "Is Golconda fort made of plastic?" },
  { name: "Test G: User asks for source", query: "Sources for Modhera Sun Temple" },
];

for (const t of tests) {
  console.log(`>>> ${t.name}`);
  console.log(`Query: "${t.query}"`);
  const res = answerQuestion(t.query, "en");
  console.log(`Confidence: ${res.confidence}`);
  console.log(`Status: ${res.status}`);
  console.log(`Can Report: ${res.canReport}`);
  console.log(`Sources Count: ${res.sources.length}`);
  if (res.suggestions) console.log(`Suggestions: ${res.suggestions.join(", ")}`);
  console.log("Answer snippet:");
  console.log(res.text.slice(0, 300) + (res.text.length > 300 ? "..." : ""));
  console.log("-------------------------------------------------\n");
}
