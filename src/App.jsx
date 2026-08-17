import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Flame, CheckCircle2, Circle, Code2, Database, LayoutGrid, ListChecks,
  TrendingUp, RotateCcw, ChevronDown, ChevronRight, Plus, Trash2, Target,
  Play, Square, Timer as TimerIcon, XCircle, Loader2,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// ---------------------------------------------------------------------------
// Static curriculum data
// ---------------------------------------------------------------------------
const DSA_TOPICS = [
  { id: "arrays", name: "Arrays", questions: [
    { id: "arr1", t: "Kadane's algorithm — max subarray sum", d: "Easy" },
    { id: "arr2", t: "Move all zeros to the end", d: "Easy" },
    { id: "arr3", t: "Find the missing number 1..N", d: "Easy" },
    { id: "arr4", t: "Two Sum", d: "Easy" },
    { id: "arr5", t: "Best time to buy & sell stock", d: "Easy" },
    { id: "arr6", t: "Product of array except self", d: "Medium" },
    { id: "arr7", t: "3Sum", d: "Medium" },
    { id: "arr8", t: "Rotate array by k steps", d: "Medium" },
    { id: "arr9", t: "Merge overlapping intervals", d: "Medium" },
    { id: "arr10", t: "Next permutation", d: "Medium" },
    { id: "arr11", t: "Trapping rain water", d: "Hard" },
    { id: "arr12", t: "Median of two sorted arrays", d: "Hard" },
  ]},
  { id: "strings", name: "Strings", questions: [
    { id: "str1", t: "Reverse words in a string", d: "Easy" },
    { id: "str2", t: "Valid anagram", d: "Easy" },
    { id: "str3", t: "Valid palindrome", d: "Easy" },
    { id: "str4", t: "Longest common prefix", d: "Easy" },
    { id: "str5", t: "Longest substring without repeating characters", d: "Medium" },
    { id: "str6", t: "Group anagrams", d: "Medium" },
    { id: "str7", t: "String to integer (atoi)", d: "Medium" },
    { id: "str8", t: "Minimum window substring", d: "Hard" },
  ]},
  { id: "binsearch", name: "Binary Search", questions: [
    { id: "bs1", t: "Classic binary search on sorted array", d: "Easy" },
    { id: "bs2", t: "Search in rotated sorted array", d: "Medium" },
    { id: "bs3", t: "Find first & last position of element", d: "Medium" },
    { id: "bs4", t: "Find peak element", d: "Medium" },
    { id: "bs5", t: "Median of two sorted arrays (binary search approach)", d: "Hard" },
    { id: "bs6", t: "Book allocation / painter's partition (binary search on answer)", d: "Hard" },
  ]},
  { id: "twoptr", name: "Sliding Window & Two Pointers", questions: [
    { id: "tp1", t: "Max sum subarray of size K", d: "Easy" },
    { id: "tp2", t: "Container with most water", d: "Medium" },
    { id: "tp3", t: "Longest substring with K distinct characters", d: "Medium" },
    { id: "tp4", t: "Sliding window maximum", d: "Hard" },
    { id: "tp5", t: "Minimum size subarray sum", d: "Medium" },
  ]},
  { id: "linkedlist", name: "Linked List", questions: [
    { id: "ll1", t: "Reverse a linked list", d: "Easy" },
    { id: "ll2", t: "Detect cycle in a linked list", d: "Easy" },
    { id: "ll3", t: "Merge two sorted linked lists", d: "Easy" },
    { id: "ll4", t: "Remove Nth node from end", d: "Medium" },
    { id: "ll5", t: "Add two numbers (as linked lists)", d: "Medium" },
    { id: "ll6", t: "Reorder list", d: "Medium" },
    { id: "ll7", t: "Merge K sorted linked lists", d: "Hard" },
  ]},
  { id: "stacksq", name: "Stacks & Queues", questions: [
    { id: "sq1", t: "Valid parentheses", d: "Easy" },
    { id: "sq2", t: "Implement queue using two stacks", d: "Easy" },
    { id: "sq3", t: "Next greater element", d: "Medium" },
    { id: "sq4", t: "Min stack", d: "Medium" },
    { id: "sq5", t: "Evaluate reverse Polish notation", d: "Medium" },
    { id: "sq6", t: "Largest rectangle in histogram", d: "Hard" },
  ]},
  { id: "recursion", name: "Recursion & Backtracking", questions: [
    { id: "rec1", t: "Generate all subsets", d: "Medium" },
    { id: "rec2", t: "Permutations of an array", d: "Medium" },
    { id: "rec3", t: "Combination sum", d: "Medium" },
    { id: "rec4", t: "N-Queens", d: "Hard" },
    { id: "rec5", t: "Sudoku solver", d: "Hard" },
    { id: "rec6", t: "Word search (grid backtracking)", d: "Medium" },
  ]},
  { id: "trees", name: "Trees", questions: [
    { id: "tr1", t: "Inorder / preorder / postorder traversal", d: "Easy" },
    { id: "tr2", t: "Maximum depth of binary tree", d: "Easy" },
    { id: "tr3", t: "Level order traversal (BFS)", d: "Medium" },
    { id: "tr4", t: "Validate binary search tree", d: "Medium" },
    { id: "tr5", t: "Lowest common ancestor", d: "Medium" },
    { id: "tr6", t: "Diameter of binary tree", d: "Medium" },
    { id: "tr7", t: "Serialize & deserialize binary tree", d: "Hard" },
    { id: "tr8", t: "Binary tree maximum path sum", d: "Hard" },
  ]},
  { id: "heaps", name: "Heaps", questions: [
    { id: "hp1", t: "Kth largest element in an array", d: "Medium" },
    { id: "hp2", t: "Top K frequent elements", d: "Medium" },
    { id: "hp3", t: "Merge K sorted lists using a heap", d: "Hard" },
    { id: "hp4", t: "Find median from a data stream", d: "Hard" },
  ]},
  { id: "graphs", name: "Graphs", questions: [
    { id: "gr1", t: "BFS & DFS traversal", d: "Easy" },
    { id: "gr2", t: "Number of islands", d: "Medium" },
    { id: "gr3", t: "Course schedule (cycle detection / topo sort)", d: "Medium" },
    { id: "gr4", t: "Clone graph", d: "Medium" },
    { id: "gr5", t: "Dijkstra's shortest path", d: "Hard" },
    { id: "gr6", t: "Union-Find / number of provinces", d: "Medium" },
  ]},
  { id: "dp", name: "Dynamic Programming", questions: [
    { id: "dp1", t: "Climbing stairs", d: "Easy" },
    { id: "dp2", t: "House robber", d: "Medium" },
    { id: "dp3", t: "Longest common subsequence", d: "Medium" },
    { id: "dp4", t: "0/1 Knapsack", d: "Medium" },
    { id: "dp5", t: "Longest increasing subsequence", d: "Medium" },
    { id: "dp6", t: "Coin change", d: "Medium" },
    { id: "dp7", t: "Edit distance", d: "Hard" },
    { id: "dp8", t: "Partition equal subset sum", d: "Medium" },
  ]},
  { id: "greedy", name: "Greedy", questions: [
    { id: "gd1", t: "Activity selection / non-overlapping intervals", d: "Medium" },
    { id: "gd2", t: "Jump game", d: "Medium" },
    { id: "gd3", t: "Gas station", d: "Medium" },
    { id: "gd4", t: "Fractional knapsack", d: "Easy" },
  ]},
];

const DEV_TOPICS = [
  { id: "ts", name: "TypeScript", category: "Live class", tasks: [
    "Basic types, interfaces & type aliases",
    "Generics basics",
    "Union & intersection types",
    "Enums & type narrowing",
    "Typing React props & state",
  ]},
  { id: "node", name: "Node.js Fundamentals", category: "Backend", tasks: [
    "Event loop & async model",
    "File system & path module",
    "Building an HTTP server from scratch",
    "npm & package.json basics",
  ]},
  { id: "express", name: "Express.js & REST APIs", category: "Backend", tasks: [
    "Routing & middleware",
    "Building a CRUD REST API",
    "Error handling middleware",
    "Request validation",
  ]},
  { id: "db", name: "MongoDB & Mongoose", category: "Backend", tasks: [
    "Schemas & models",
    "CRUD with Mongoose",
    "Relationships & population",
    "Aggregation pipeline basics",
  ]},
  { id: "auth", name: "Authentication", category: "Backend", tasks: [
    "Password hashing (bcrypt)",
    "JWT — access & refresh tokens",
    "Protected routes / middleware",
    "Session-based auth basics",
  ]},
  { id: "reactbacklog", name: "React Backlog Catch-up", category: "Frontend backlog", tasks: [
    "useEffect, useMemo, useCallback deep dive",
    "Context API & prop drilling",
    "React Router",
    "Custom hooks",
    "Performance optimization basics",
  ]},
  { id: "jsbacklog", name: "JS Fundamentals Backlog", category: "Frontend backlog", tasks: [
    "Closures & scope",
    "Promises & async/await",
    "Event loop in the browser",
    "Prototypes & the `this` keyword",
  ]},
  { id: "deploy", name: "Git, GitHub & Deployment", category: "Backend", tasks: [
    "Branching & resolving merge conflicts",
    "Deploying a backend (Render/Railway)",
    "Deploying a frontend (Vercel/Netlify)",
    "Environment variables & .env",
  ]},
];

// Auto-graded weekly-test question bank. Each question is deliberately a variant
// of the topics practiced in DSA_TOPICS, not an identical copy of any single question.
// compare: "exact" (default, deep-equal via JSON.stringify) or "sortedArray" (order-insensitive array compare).
const TEST_QUESTIONS = [
  { id: "t-arr-1", topic: "arrays", title: "Two Sum", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(nums, target) that returns the indices of the two numbers that add up to target. Assume exactly one valid answer; order of the two returned indices does not matter.",
    starter: "function solve(nums, target) {\n  // return [i, j]\n}",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], compare: "sortedArray" },
      { args: [[3, 2, 4], 6], expected: [1, 2], compare: "sortedArray" },
      { args: [[3, 3], 6], expected: [0, 1], compare: "sortedArray" },
    ] },
  { id: "t-arr-2", topic: "arrays", title: "Move Zeroes", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(nums) that returns a new array with all zeroes moved to the end, keeping the relative order of the non-zero elements.",
    starter: "function solve(nums) {\n  // return new array\n}",
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0, 0, 1]], expected: [1, 0, 0] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
    ] },
  { id: "t-str-1", topic: "strings", title: "Valid Anagram", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(a, b) that returns true if strings a and b are anagrams of each other, false otherwise.",
    starter: "function solve(a, b) {\n  // return boolean\n}",
    tests: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false },
      { args: ["a", "a"], expected: true },
    ] },
  { id: "t-str-2", topic: "strings", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(s) that returns the length (a number) of the longest substring of s without repeating characters.",
    starter: "function solve(s) {\n  // return a number\n}",
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["bbbbb"], expected: 1 },
      { args: ["pwwkew"], expected: 3 },
    ] },
  { id: "t-bs-1", topic: "binsearch", title: "Binary Search", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(nums, target) that returns the index of target in the sorted array nums, or -1 if not present. Must run in O(log n).",
    starter: "function solve(nums, target) {\n  // return index or -1\n}",
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
    ] },
  { id: "t-bs-2", topic: "binsearch", title: "Search Insert Position", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(nums, target) that returns the index where target is found, or the index it would be inserted to keep nums sorted.",
    starter: "function solve(nums, target) {\n  // return index\n}",
    tests: [
      { args: [[1, 3, 5, 6], 5], expected: 2 },
      { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 },
    ] },
  { id: "t-tp-1", topic: "twoptr", title: "Container With Most Water", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(heights) that returns the maximum water area two lines (by index, using the shorter height) can hold.",
    starter: "function solve(heights) {\n  // return a number\n}",
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
    ] },
  { id: "t-tp-2", topic: "twoptr", title: "Max Sum Subarray of Size K", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(nums, k) that returns the maximum sum of any contiguous subarray of size k.",
    starter: "function solve(nums, k) {\n  // return a number\n}",
    tests: [
      { args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
      { args: [[2, 3, 4, 1, 5], 2], expected: 7 },
    ] },
  { id: "t-sq-1", topic: "stacksq", title: "Valid Parentheses", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(s) that returns true if the brackets in s ( ( ) [ ] { } ) are balanced and correctly nested, false otherwise.",
    starter: "function solve(s) {\n  // return boolean\n}",
    tests: [
      { args: ["()[]{}"], expected: true },
      { args: ["(]"], expected: false },
      { args: ["([)]"], expected: false },
      { args: ["{[]}"], expected: true },
    ] },
  { id: "t-sq-2", topic: "stacksq", title: "Next Greater Element", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(nums) that returns an array where each element is the next number to its right that is greater, or -1 if none exists.",
    starter: "function solve(nums) {\n  // return an array, same length as nums\n}",
    tests: [
      { args: [[2, 1, 2, 4, 3]], expected: [4, 2, 4, -1, -1] },
    ] },
  { id: "t-rec-1", topic: "recursion", title: "Count Valid Parenthesis Combinations", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(n) that returns the count (a number) of distinct valid combinations of n pairs of parentheses.",
    starter: "function solve(n) {\n  // return a number\n}",
    tests: [
      { args: [3], expected: 5 },
      { args: [1], expected: 1 },
      { args: [2], expected: 2 },
    ] },
  { id: "t-rec-2", topic: "recursion", title: "Count Subsets With Given Sum", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(nums, target) that returns the count (a number) of subsets of nums whose elements sum to target.",
    starter: "function solve(nums, target) {\n  // return a number\n}",
    tests: [
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[1, 1, 1], 2], expected: 3 },
    ] },
  { id: "t-dp-1", topic: "dp", title: "Climbing Stairs", difficulty: "Easy", minutes: 10,
    prompt: "Write solve(n) that returns the number of distinct ways to climb n stairs, taking 1 or 2 steps at a time.",
    starter: "function solve(n) {\n  // return a number\n}",
    tests: [
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [5], expected: 8 },
    ] },
  { id: "t-dp-2", topic: "dp", title: "House Robber", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(nums) that returns the maximum sum obtainable by picking non-adjacent elements from nums.",
    starter: "function solve(nums) {\n  // return a number\n}",
    tests: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
    ] },
  { id: "t-gd-1", topic: "greedy", title: "Jump Game", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(nums) that returns true if you can reach the last index, starting at index 0, where nums[i] is the max jump length from index i.",
    starter: "function solve(nums) {\n  // return boolean\n}",
    tests: [
      { args: [[2, 3, 1, 1, 4]], expected: true },
      { args: [[3, 2, 1, 0, 4]], expected: false },
    ] },
  { id: "t-gd-2", topic: "greedy", title: "Gas Station", difficulty: "Medium", minutes: 15,
    prompt: "Write solve(gas, cost) that returns the starting gas-station index from which you can travel the full circuit, or -1 if impossible. Assume a unique answer when one exists.",
    starter: "function solve(gas, cost) {\n  // return index or -1\n}",
    tests: [
      { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
      { args: [[2, 3, 4], [3, 4, 3]], expected: -1 },
    ] },
];

function compareValues(actual, expected, mode) {
  if (mode === "sortedArray") {
    if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
    const a = [...actual].sort((x, y) => x - y);
    const b = [...expected].sort((x, y) => x - y);
    return JSON.stringify(a) === JSON.stringify(b);
  }
  return JSON.stringify(actual) === JSON.stringify(expected);
}

// Runs user code against test cases inside a sandboxed Web Worker (own thread,
// no DOM/network access) with a hard timeout so an infinite loop can't hang the page.
function runCode(code, tests) {
  return new Promise((resolve) => {
    const workerSrc = `
      self.onmessage = function (e) {
        const { code, tests } = e.data;
        try {
          const solve = new Function(code + '\\nreturn solve;')();
          const results = tests.map((tc) => {
            try {
              const actual = solve(...tc.args);
              self.__lastActual = actual;
              return { actual };
            } catch (err) {
              return { error: String((err && err.message) || err) };
            }
          });
          self.postMessage({ ok: true, results });
        } catch (err) {
          self.postMessage({ ok: false, error: String((err && err.message) || err) });
        }
      };
    `;
    let worker;
    let settled = false;
    const finish = (payload) => { if (!settled) { settled = true; try { worker.terminate(); } catch (e) {} resolve(payload); } };
    try {
      const blob = new Blob([workerSrc], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      resolve({ ok: false, error: "Could not start the code runner in this browser." });
      return;
    }
    const timer = setTimeout(() => finish({ ok: false, error: "Timed out — check for an infinite loop." }), 4000);
    worker.onmessage = (e) => { clearTimeout(timer); finish(e.data); };
    worker.onerror = (e) => { clearTimeout(timer); finish({ ok: false, error: e.message || "Runtime error" }); };
    worker.postMessage({ code, tests: tests.map((t) => ({ args: t.args })) });
  });
}

function getStudiedTopicIds(state) {
  const cutoff = addDays(today(), -7);
  const ids = new Set();
  DSA_TOPICS.forEach((topic) => {
    topic.questions.forEach((q) => {
      const d = state.completedDsaDates?.[q.id];
      if (d && d >= cutoff) ids.add(topic.id);
    });
  });
  return ids;
}

function generateWeeklyTest(state) {
  const studied = getStudiedTopicIds(state);
  const bankTopics = [...new Set(TEST_QUESTIONS.map((q) => q.topic))];
  let candidateTopics = bankTopics.filter((t) => studied.has(t));
  if (candidateTopics.length === 0) candidateTopics = bankTopics;
  const recent = state.lastTestQuestionIds || [];
  const picked = [];
  const shuffledTopics = [...candidateTopics].sort(() => Math.random() - 0.5).slice(0, 4);
  shuffledTopics.forEach((topicId) => {
    const options = TEST_QUESTIONS.filter((q) => q.topic === topicId && !recent.includes(q.id));
    const pool = options.length > 0 ? options : TEST_QUESTIONS.filter((q) => q.topic === topicId);
    if (pool.length > 0) picked.push(pool[Math.floor(Math.random() * pool.length)]);
  });
  if (picked.length === 0) picked.push(TEST_QUESTIONS[Math.floor(Math.random() * TEST_QUESTIONS.length)]);
  return picked;
}

const DIFF_COLOR = { Easy: "text-emerald-400", Medium: "text-amber-400", Hard: "text-rose-400" };
const STORAGE_KEY = "prep-tracker-state-v1";

// Simple localStorage-backed replacement for the Claude-artifact `window.storage` API,
// so this file runs unmodified in a normal browser / Vercel deployment.
const storage = {
  async get(key) {
    const raw = window.localStorage.getItem(key);
    return raw ? { key, value: raw } : null;
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
    return { key, value };
  },
};

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
const fmt = (d) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const today = () => fmt(new Date());
const addDays = (dateStr, n) => { const d = new Date(dateStr + "T00:00:00"); d.setDate(d.getDate() + n); return fmt(d); };

function defaultState() {
  return {
    completedDsa: {},
    completedDev: {},
    dsaPointer: 0,
    devPointer: 0,
    dailyPlans: {},
    activityLog: {},
    weeklyTests: [],
    completedDsaDates: {},
    lastTestQuestionIds: [],
    createdAt: today(),
  };
}

// ---------------------------------------------------------------------------
// Plan generation
// ---------------------------------------------------------------------------
function pickDsa(state) {
  for (let i = state.dsaPointer; i < DSA_TOPICS.length; i++) {
    const topic = DSA_TOPICS[i];
    const remaining = topic.questions.filter((q) => !state.completedDsa[q.id]);
    if (remaining.length > 0) return { topicIdx: i, topicName: topic.name, questions: remaining.slice(0, 3) };
  }
  return null;
}
function flatDevTasks() {
  const out = [];
  DEV_TOPICS.forEach((topic) => topic.tasks.forEach((task, idx) => out.push({ id: `${topic.id}::${idx}`, topicName: topic.name, task })));
  return out;
}
function pickDev(state) {
  const flat = flatDevTasks();
  const remaining = flat.filter((t) => !state.completedDev[t.id]);
  return remaining.slice(0, 2);
}
function pickRevision(state, excludeTopicIdx) {
  const doneIds = Object.keys(state.completedDsa).filter((id) => state.completedDsa[id]);
  if (doneIds.length === 0) return null;
  const pool = doneIds.filter((id) => {
    const topicIdx = DSA_TOPICS.findIndex((t) => t.questions.some((q) => q.id === id));
    return topicIdx !== excludeTopicIdx;
  });
  const from = pool.length > 0 ? pool : doneIds;
  const pickedId = from[Math.floor(Math.random() * from.length)];
  for (const topic of DSA_TOPICS) {
    const q = topic.questions.find((q) => q.id === pickedId);
    if (q) return { topicName: topic.name, question: q };
  }
  return null;
}
function generatePlan(state, dateStr) {
  const dsa = pickDsa(state);
  const dev = pickDev(state);
  const revision = pickRevision(state, dsa ? dsa.topicIdx : -1);
  return {
    date: dateStr,
    dsaTopicIdx: dsa ? dsa.topicIdx : null,
    dsaQuestionIds: dsa ? dsa.questions.map((q) => q.id) : [],
    devTaskIds: dev.map((t) => t.id),
    revision: revision ? { topicName: revision.topicName, questionId: revision.question.id, questionTitle: revision.question.t } : null,
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function PrepTracker() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    (async () => {
      let loaded = null;
      try {
        const res = await storage.get(STORAGE_KEY);
        if (res && res.value) loaded = JSON.parse(res.value);
      } catch (e) { /* no existing state */ }
      if (!loaded) loaded = defaultState();
      const t = today();
      if (!loaded.dailyPlans[t]) {
        loaded.dailyPlans[t] = generatePlan(loaded, t);
      }
      setState(loaded);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setState(next);
    try { await storage.set(STORAGE_KEY, JSON.stringify(next)); } catch (e) { /* ignore */ }
  }, []);

  const recomputeActivity = useCallback((s, dateStr) => {
    const plan = s.dailyPlans[dateStr];
    if (!plan) return s;
    const totalItems = plan.dsaQuestionIds.length + plan.devTaskIds.length;
    const doneItems = plan.dsaQuestionIds.filter((id) => s.completedDsa[id]).length +
      plan.devTaskIds.filter((id) => s.completedDev[id]).length;
    const completed = totalItems > 0 && doneItems === totalItems;
    return { ...s, activityLog: { ...s.activityLog, [dateStr]: { done: doneItems, total: totalItems, completed } } };
  }, []);

  const toggleDsa = useCallback((qid) => {
    setState((prev) => {
      const willComplete = !prev.completedDsa[qid];
      const nextDates = { ...prev.completedDsaDates };
      if (willComplete) nextDates[qid] = today(); else delete nextDates[qid];
      let next = { ...prev, completedDsa: { ...prev.completedDsa, [qid]: willComplete }, completedDsaDates: nextDates };
      const plan = next.dailyPlans[today()];
      if (plan && plan.dsaTopicIdx !== null) {
        const topic = DSA_TOPICS[plan.dsaTopicIdx];
        if (topic.questions.every((q) => next.completedDsa[q.id])) {
          next.dsaPointer = Math.min(plan.dsaTopicIdx + 1, DSA_TOPICS.length - 1);
        }
      }
      next = recomputeActivity(next, today());
      persist(next);
      return next;
    });
  }, [persist, recomputeActivity]);

  const toggleDev = useCallback((tid) => {
    setState((prev) => {
      let next = { ...prev, completedDev: { ...prev.completedDev, [tid]: !prev.completedDev[tid] } };
      next = recomputeActivity(next, today());
      persist(next);
      return next;
    });
  }, [persist, recomputeActivity]);

  const addWeeklyTest = useCallback((entry) => {
    setState((prev) => {
      const next = { ...prev, weeklyTests: [...prev.weeklyTests, entry] };
      persist(next);
      return next;
    });
  }, [persist]);

  const finishCodingTest = useCallback((entry, questionIds) => {
    setState((prev) => {
      const next = {
        ...prev,
        weeklyTests: [...prev.weeklyTests, entry],
        lastTestQuestionIds: questionIds,
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const deleteWeeklyTest = useCallback((id) => {
    setState((prev) => {
      const next = { ...prev, weeklyTests: prev.weeklyTests.filter((t) => t.id !== id) };
      persist(next);
      return next;
    });
  }, [persist]);

  const streak = useMemo(() => {
    if (!state) return 0;
    let count = 0;
    let d = today();
    if (!state.activityLog[d]?.completed) d = addDays(d, -1);
    while (state.activityLog[d]?.completed) { count++; d = addDays(d, -1); }
    return count;
  }, [state]);

  const totalDsaDone = useMemo(() => state ? Object.values(state.completedDsa).filter(Boolean).length : 0, [state]);
  const totalDsaCount = useMemo(() => DSA_TOPICS.reduce((s, t) => s + t.questions.length, 0), []);
  const totalDevDone = useMemo(() => state ? Object.values(state.completedDev).filter(Boolean).length : 0, [state]);
  const totalDevCount = useMemo(() => flatDevTasks().length, []);

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 font-mono">loading tracker…</p>
      </div>
    );
  }

  const plan = state.dailyPlans[today()];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        .fm { font-family: 'JetBrains Mono', monospace; }
        .fs { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <p className="fm text-[11px] tracking-widest text-cyan-400 uppercase">placement grind log</p>
            <h1 className="fs text-xl font-bold text-slate-50">Prep Tracker</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2">
            <Flame className={streak > 0 ? "text-amber-400" : "text-slate-600"} size={20} />
            <span className="fm text-lg font-bold text-slate-50">{streak}</span>
            <span className="fs text-xs text-slate-400">day streak</span>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {[
            { id: "today", label: "Today", icon: Target },
            { id: "dsa", label: "DSA", icon: ListChecks },
            { id: "dev", label: "Dev", icon: Code2 },
            { id: "tests", label: "Weekly tests", icon: TrendingUp },
            { id: "progress", label: "Progress", icon: LayoutGrid },
          ].map((tItem) => (
            <button
              key={tItem.id}
              onClick={() => setTab(tItem.id)}
              className={`fs flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors ${
                tab === tItem.id ? "bg-amber-400 text-slate-950 font-semibold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <tItem.icon size={15} /> {tItem.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "today" && (
          <TodayView plan={plan} state={state} toggleDsa={toggleDsa} toggleDev={toggleDev} />
        )}
        {tab === "dsa" && (
          <TopicListView
            title="DSA topics"
            subtitle={`${totalDsaDone} / ${totalDsaCount} questions solved`}
            openTopics={openTopics} setOpenTopics={setOpenTopics}
            items={DSA_TOPICS.map((topic) => ({
              id: topic.id, name: topic.name,
              done: topic.questions.filter((q) => state.completedDsa[q.id]).length,
              total: topic.questions.length,
              rows: topic.questions.map((q) => ({
                id: q.id, label: q.t, meta: q.d, metaClass: DIFF_COLOR[q.d],
                checked: !!state.completedDsa[q.id], onToggle: () => toggleDsa(q.id),
              })),
            }))}
          />
        )}
        {tab === "dev" && (
          <TopicListView
            title="Development topics"
            subtitle={`${totalDevDone} / ${totalDevCount} tasks done · covers live-class TypeScript, backend & frontend backlog`}
            openTopics={openTopics} setOpenTopics={setOpenTopics}
            items={DEV_TOPICS.map((topic) => ({
              id: topic.id, name: `${topic.name}`, badge: topic.category,
              done: topic.tasks.filter((_, i) => state.completedDev[`${topic.id}::${i}`]).length,
              total: topic.tasks.length,
              rows: topic.tasks.map((task, i) => ({
                id: `${topic.id}::${i}`, label: task, meta: "", metaClass: "",
                checked: !!state.completedDev[`${topic.id}::${i}`], onToggle: () => toggleDev(`${topic.id}::${i}`),
              })),
            }))}
          />
        )}
        {tab === "tests" && (
          <WeeklyTestsView tests={state.weeklyTests} onAdd={addWeeklyTest} onDelete={deleteWeeklyTest}
            state={state} onFinishCodingTest={finishCodingTest} />
        )}
        {tab === "progress" && (
          <ProgressView state={state} streak={streak} totalDsaDone={totalDsaDone} totalDsaCount={totalDsaCount}
            totalDevDone={totalDevDone} totalDevCount={totalDevCount} />
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Today view
// ---------------------------------------------------------------------------
function TodayView({ plan, state, toggleDsa, toggleDev }) {
  const dsaTopic = plan.dsaTopicIdx !== null ? DSA_TOPICS[plan.dsaTopicIdx] : null;
  const dsaQuestions = dsaTopic ? dsaTopic.questions.filter((q) => plan.dsaQuestionIds.includes(q.id)) : [];
  const flat = flatDevTasks();
  const devTasks = flat.filter((t) => plan.devTaskIds.includes(t.id));
  const totalItems = plan.dsaQuestionIds.length + plan.devTaskIds.length;
  const doneItems = plan.dsaQuestionIds.filter((id) => state.completedDsa[id]).length + plan.devTaskIds.filter((id) => state.completedDev[id]).length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <p className="fm text-xs text-cyan-400 uppercase tracking-widest">Today's goal</p>
          <p className="fm text-sm text-slate-400">{doneItems}/{totalItems} done</p>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 transition-all" style={{ width: totalItems ? `${(doneItems / totalItems) * 100}%` : "0%" }} />
        </div>
        {totalItems === 0 && (
          <p className="fs text-sm text-emerald-400 mt-3">You've cleared every listed question and task — nice work. Head to DSA/Dev tabs to add more, or just rest.</p>
        )}
      </div>

      {dsaQuestions.length > 0 && (
        <section>
          <SectionHeader icon={ListChecks} title="DSA" subtitle={dsaTopic?.name} />
          <ChecklistCard rows={dsaQuestions.map((q) => ({
            id: q.id, label: q.t, meta: q.d, metaClass: DIFF_COLOR[q.d],
            checked: !!state.completedDsa[q.id], onToggle: () => toggleDsa(q.id),
          }))} />
        </section>
      )}

      {devTasks.length > 0 && (
        <section>
          <SectionHeader icon={Code2} title="Development" subtitle="TypeScript / backend / backlog" />
          <ChecklistCard rows={devTasks.map((t) => ({
            id: t.id, label: t.task, meta: t.topicName, metaClass: "text-cyan-400",
            checked: !!state.completedDev[t.id], onToggle: () => toggleDev(t.id),
          }))} />
        </section>
      )}

      {plan.revision && (
        <section>
          <SectionHeader icon={RotateCcw} title="Revision" subtitle="5–10 min recall, no need to re-code fully" />
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="fs text-sm text-slate-200">{plan.revision.questionTitle}</p>
              <p className="fm text-xs text-slate-500 mt-0.5">{plan.revision.topicName}</p>
            </div>
            <RotateCcw size={16} className="text-slate-600" />
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-amber-400" />
      <h2 className="fs font-semibold text-slate-100">{title}</h2>
      {subtitle && <span className="fm text-xs text-slate-500">— {subtitle}</span>}
    </div>
  );
}

function ChecklistCard({ rows }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
      {rows.map((r) => (
        <button key={r.id} onClick={r.onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/50 transition-colors">
          {r.checked ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <Circle size={18} className="text-slate-600 shrink-0" />}
          <span className={`fs text-sm flex-1 ${r.checked ? "line-through text-slate-500" : "text-slate-200"}`}>{r.label}</span>
          {r.meta && <span className={`fm text-xs ${r.metaClass}`}>{r.meta}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topic list (DSA / Dev tabs) — accordion
// ---------------------------------------------------------------------------
function TopicListView({ title, subtitle, items, openTopics, setOpenTopics }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="fs text-lg font-bold text-slate-50">{title}</h2>
        <p className="fm text-xs text-slate-500">{subtitle}</p>
      </div>
      <div className="space-y-3">
        {items.map((topic) => {
          const open = !!openTopics[topic.id];
          const pct = topic.total ? Math.round((topic.done / topic.total) * 100) : 0;
          return (
            <div key={topic.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <button onClick={() => setOpenTopics((p) => ({ ...p, [topic.id]: !p[topic.id] }))}
                className="w-full flex items-center gap-3 px-4 py-3 text-left">
                {open ? <ChevronDown size={16} className="text-slate-500" /> : <ChevronRight size={16} className="text-slate-500" />}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="fs font-medium text-slate-100">{topic.name}</span>
                    {topic.badge && <span className="fm text-[10px] uppercase tracking-wide text-cyan-400 border border-cyan-900 rounded px-1.5 py-0.5">{topic.badge}</span>}
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="fm text-xs text-slate-400 shrink-0">{topic.done}/{topic.total}</span>
              </button>
              {open && (
                <div className="border-t border-slate-800 divide-y divide-slate-800">
                  {topic.rows.map((r) => (
                    <button key={r.id} onClick={r.onToggle} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-800/50">
                      {r.checked ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <Circle size={16} className="text-slate-600 shrink-0" />}
                      <span className={`fs text-sm flex-1 ${r.checked ? "line-through text-slate-500" : "text-slate-300"}`}>{r.label}</span>
                      {r.meta && <span className={`fm text-xs ${r.metaClass}`}>{r.meta}</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Weekly tests
// ---------------------------------------------------------------------------
function WeeklyTestsView({ tests, onAdd, onDelete, state, onFinishCodingTest }) {
  const [session, setSession] = useState(null); // active coding-test session
  const [showManual, setShowManual] = useState(false);

  const studiedTopicNames = useMemo(() => {
    const ids = getStudiedTopicIds(state);
    return DSA_TOPICS.filter((t) => ids.has(t.id)).map((t) => t.name);
  }, [state]);

  const startTest = () => {
    const questions = generateWeeklyTest(state);
    setSession({
      questions,
      startedAt: Date.now(),
      durationSec: questions.reduce((s, q) => s + q.minutes * 60, 0),
      index: 0,
      answers: Object.fromEntries(questions.map((q) => [q.id, { code: q.starter, passed: 0, total: q.tests.length, results: null }])),
    });
  };

  const handleFinish = (finalAnswers, questions, elapsedSec) => {
    const totalPassed = questions.reduce((s, q) => s + (finalAnswers[q.id]?.passed || 0), 0);
    const totalCases = questions.reduce((s, q) => s + q.tests.length, 0);
    const topicNames = [...new Set(questions.map((q) => DSA_TOPICS.find((t) => t.id === q.topic)?.name || q.topic))];
    const entry = {
      id: `${Date.now()}`,
      date: today(),
      topic: `Weekly test — ${topicNames.join(", ")}`,
      score: totalPassed,
      total: totalCases,
      breakdown: questions.map((q) => ({ title: q.title, passed: finalAnswers[q.id]?.passed || 0, total: q.tests.length })),
      elapsedSec,
    };
    onFinishCodingTest(entry, questions.map((q) => q.id));
    setSession(null);
  };

  if (session) {
    return <CodingTestRunner session={session} setSession={setSession} onFinish={handleFinish} onCancel={() => setSession(null)} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="fs text-lg font-bold text-slate-50">Weekly tests</h2>
        <p className="fm text-xs text-slate-500">Auto-graded coding tests, generated from what you studied this week</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <TimerIcon size={16} className="text-amber-400" />
          <h3 className="fs font-semibold text-slate-100">This week's test</h3>
        </div>
        <p className="fs text-sm text-slate-400 mb-1">
          {studiedTopicNames.length > 0
            ? `Pulled from what you've solved this week: ${studiedTopicNames.join(", ")}.`
            : "No completed topics logged this week yet — this'll pull a general mix instead."}
        </p>
        <p className="fs text-xs text-slate-500 mb-4">4 questions, timed, similar to — not copies of — your practice questions. Write real code; test cases run for real in your browser.</p>
        <button onClick={startTest} className="flex items-center gap-2 bg-amber-400 text-slate-950 font-semibold rounded-md px-4 py-2 text-sm">
          <Play size={15} /> Start test
        </button>
      </div>

      <button onClick={() => setShowManual((s) => !s)} className="fs text-xs text-cyan-400 hover:underline">
        {showManual ? "Hide manual entry" : "Log a score from an external test (LeetCode/GfG contest, college test) instead →"}
      </button>
      {showManual && <ManualTestForm onAdd={onAdd} />}

      <TestHistory tests={tests} onDelete={onDelete} />
    </div>
  );
}

function ManualTestForm({ onAdd }) {
  const [date, setDate] = useState(today());
  const [topicName, setTopicName] = useState("");
  const [score, setScore] = useState("");
  const [total, setTotal] = useState("");

  const submit = () => {
    if (!topicName || score === "" || total === "") return;
    onAdd({ id: `${Date.now()}`, date, topic: topicName, score: Number(score), total: Number(total) });
    setTopicName(""); setScore(""); setTotal("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 items-end">
        <div className="col-span-2 sm:col-span-1">
          <label className="fm text-[10px] text-slate-500 uppercase">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="fs w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="fm text-[10px] text-slate-500 uppercase">Topic</label>
          <input value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="e.g. Arrays" className="fs w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200" />
        </div>
        <div>
          <label className="fm text-[10px] text-slate-500 uppercase">Score</label>
          <input type="number" value={score} onChange={(e) => setScore(e.target.value)} className="fs w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200" />
        </div>
        <div>
          <label className="fm text-[10px] text-slate-500 uppercase">Out of</label>
          <input type="number" value={total} onChange={(e) => setTotal(e.target.value)} className="fs w-full mt-1 bg-slate-800 border border-slate-700 rounded-md px-2 py-1.5 text-sm text-slate-200" />
        </div>
        <button onClick={submit} className="flex items-center justify-center gap-1.5 bg-amber-400 text-slate-950 font-semibold rounded-md px-3 py-1.5 text-sm h-[34px]">
          <Plus size={15} /> Add
        </button>
      </div>
    </div>
  );
}

function TestHistory({ tests, onDelete }) {
  const sorted = [...tests].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sorted.map((t) => ({ date: t.date.slice(5), pct: Math.round((t.score / t.total) * 100) }));

  return (
    <div className="space-y-4">
      {chartData.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", fontSize: 12 }} />
              <Line type="monotone" dataKey="pct" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3 }} name="Score %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
        {sorted.length === 0 && <p className="fs text-sm text-slate-500 px-4 py-6 text-center">No test scores logged yet.</p>}
        {[...sorted].reverse().map((t) => (
          <div key={t.id} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="fs text-sm text-slate-200">{t.topic}</p>
                <p className="fm text-xs text-slate-500">{t.date}{t.elapsedSec ? ` · ${Math.round(t.elapsedSec / 60)} min` : ""}</p>
              </div>
              <span className="fm text-sm text-amber-400 font-semibold">{t.score}/{t.total}</span>
              <button onClick={() => onDelete(t.id)} className="text-slate-600 hover:text-rose-400"><Trash2 size={15} /></button>
            </div>
            {t.breakdown && (
              <div className="mt-2 flex flex-wrap gap-2">
                {t.breakdown.map((b, i) => (
                  <span key={i} className="fm text-[10px] text-slate-500 bg-slate-800 rounded px-1.5 py-0.5">{b.title}: {b.passed}/{b.total}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Coding test runner — timer + in-browser judge
// ---------------------------------------------------------------------------
function CodingTestRunner({ session, setSession, onFinish, onCancel }) {
  const { questions, answers, index, durationSec, startedAt } = session;
  const q = questions[index];
  const [code, setCode] = useState(answers[q.id].code);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(answers[q.id].results);
  const [remaining, setRemaining] = useState(durationSec - Math.floor((Date.now() - startedAt) / 1000));
  const [confirmEnd, setConfirmEnd] = useState(false);

  useEffect(() => {
    setCode(session.answers[q.id].code);
    setResults(session.answers[q.id].results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const latestRef = React.useRef();
  latestRef.current = { code, session, q, index, questions, answers: session.answers };

  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(tick); latestRef.current && handleTimeUpRef.current(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTimeUpRef = React.useRef();
  handleTimeUpRef.current = async () => {
    const { code: c, session: s, q: curQ } = latestRef.current;
    if (!s.answers[curQ.id].results) {
      const out = await runCode(c, curQ.tests);
      let passed = 0;
      let details = [];
      if (out.ok) {
        details = curQ.tests.map((tc, i) => {
          const r = out.results[i] || {};
          const pass = !r.error && compareValues(r.actual, tc.expected, tc.compare);
          if (pass) passed++;
          return { pass, actual: r.actual, error: r.error, expected: tc.expected, args: tc.args };
        });
      } else {
        details = curQ.tests.map((tc) => ({ pass: false, error: out.error, expected: tc.expected, args: tc.args }));
      }
      s.answers = { ...s.answers, [curQ.id]: { code: c, passed, total: curQ.tests.length, results: details } };
    } else {
      s.answers = { ...s.answers, [curQ.id]: { ...s.answers[curQ.id], code: c } };
    }
    const elapsed = Math.floor((Date.now() - s.startedAt) / 1000);
    onFinish(s.answers, latestRef.current.questions, elapsed);
  };

  const saveCurrentCode = (nextCode) => {
    setCode(nextCode);
    session.answers = { ...session.answers, [q.id]: { ...session.answers[q.id], code: nextCode } };
  };

  const runCurrent = async () => {
    setRunning(true);
    const out = await runCode(code, q.tests);
    setRunning(false);
    let passed = 0;
    let details = [];
    if (out.ok) {
      details = q.tests.map((tc, i) => {
        const r = out.results[i] || {};
        const pass = !r.error && compareValues(r.actual, tc.expected, tc.compare);
        if (pass) passed++;
        return { pass, actual: r.actual, error: r.error, expected: tc.expected, args: tc.args };
      });
    } else {
      details = q.tests.map((tc) => ({ pass: false, error: out.error, expected: tc.expected, args: tc.args }));
    }
    setResults(details);
    session.answers = { ...session.answers, [q.id]: { code, passed, total: q.tests.length, results: details } };
    setSession({ ...session });
    return { passed, details };
  };

  const goTo = (i) => {
    session.answers = { ...session.answers, [q.id]: { ...session.answers[q.id], code } };
    setSession({ ...session, index: i });
  };

  const handleNext = async () => {
    if (!results) await runCurrent();
    if (index < questions.length - 1) goTo(index + 1);
    else finalize();
  };

  const finalize = () => {
    session.answers = { ...session.answers, [q.id]: { ...session.answers[q.id], code } };
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    onFinish(session.answers, questions, elapsed);
  };

  const mm = String(Math.floor(Math.max(remaining, 0) / 60)).padStart(2, "0");
  const ss = String(Math.max(remaining, 0) % 60).padStart(2, "0");
  const low = remaining < 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-3">
        <div className="flex gap-1.5">
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={() => goTo(i)}
              className={`w-7 h-7 rounded-md fm text-xs flex items-center justify-center border ${
                i === index ? "border-amber-400 text-amber-400" : answers[qq.id]?.results ? "border-emerald-800 text-emerald-400" : "border-slate-700 text-slate-500"
              }`}>{i + 1}</button>
          ))}
        </div>
        <div className={`flex items-center gap-1.5 fm text-sm font-bold ${low ? "text-rose-400" : "text-slate-200"}`}>
          <TimerIcon size={15} /> {mm}:{ss}
        </div>
        <button onClick={() => setConfirmEnd(true)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-400 fs">
          <Square size={13} /> End test
        </button>
      </div>

      {confirmEnd && (
        <div className="bg-rose-950/40 border border-rose-900 rounded-xl p-4 flex items-center justify-between">
          <p className="fs text-sm text-rose-200">End the test now? Your score so far will be saved.</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmEnd(false)} className="fs text-xs px-3 py-1.5 rounded-md border border-slate-700 text-slate-300">Keep going</button>
            <button onClick={finalize} className="fs text-xs px-3 py-1.5 rounded-md bg-rose-500 text-white font-semibold">End & save</button>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="fs font-semibold text-slate-100">{q.title}</h3>
          <span className={`fm text-[10px] uppercase ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
          <span className="fm text-[10px] text-slate-500">~{q.minutes} min</span>
        </div>
        <p className="fs text-sm text-slate-400">{q.prompt}</p>
      </div>

      <textarea
        value={code}
        onChange={(e) => saveCurrentCode(e.target.value)}
        spellCheck={false}
        className="fm w-full h-56 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
      />

      <div className="flex items-center gap-3">
        <button onClick={runCurrent} disabled={running}
          className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-100 rounded-md px-4 py-2 text-sm fs disabled:opacity-50">
          {running ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />} Run tests
        </button>
        <button onClick={handleNext}
          className="flex items-center gap-2 bg-amber-400 text-slate-950 font-semibold rounded-md px-4 py-2 text-sm fs">
          {index < questions.length - 1 ? "Save & next" : "Finish test"}
        </button>
        {results && <span className="fm text-sm text-slate-300">{results.filter((r) => r.pass).length}/{results.length} test cases passed</span>}
      </div>

      {results && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800">
          {results.map((r, i) => (
            <div key={i} className="px-4 py-2.5 flex items-start gap-2">
              {r.pass ? <CheckCircle2 size={15} className="text-emerald-400 mt-0.5 shrink-0" /> : <XCircle size={15} className="text-rose-400 mt-0.5 shrink-0" />}
              <div className="fm text-xs text-slate-400">
                <span className="text-slate-500">input:</span> {JSON.stringify(r.args)} <span className="text-slate-500 ml-2">expected:</span> {JSON.stringify(r.expected)}
                {!r.pass && <span className="text-rose-400 ml-2">got: {r.error ? r.error : JSON.stringify(r.actual)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Progress view — contribution grid + stats
// ---------------------------------------------------------------------------
function ProgressView({ state, streak, totalDsaDone, totalDsaCount, totalDevDone, totalDevCount }) {
  const days = 84;
  const cells = useMemo(() => {
    const out = [];
    let d = today();
    for (let i = 0; i < days; i++) { out.unshift(d); d = addDays(d, -1); }
    return out;
  }, []);

  const intensity = (dateStr) => {
    const log = state.activityLog[dateStr];
    if (!log || log.done === 0) return "bg-slate-800";
    const ratio = log.total ? log.done / log.total : 0;
    if (log.completed) return "bg-emerald-400";
    if (ratio >= 0.5) return "bg-amber-500";
    return "bg-amber-800";
  };

  // group into weeks (columns)
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="fs text-lg font-bold text-slate-50">Progress</h2>
        <p className="fm text-xs text-slate-500">The grind grid — each square is a day, brighter means more of that day's plan was cleared</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 overflow-x-auto">
        <div className="flex gap-1 w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((d) => (
                <div key={d} title={d} className={`w-3 h-3 rounded-sm ${intensity(d)}`} />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 fm text-[10px] text-slate-500">
          <span>less</span>
          <div className="w-3 h-3 rounded-sm bg-slate-800" />
          <div className="w-3 h-3 rounded-sm bg-amber-800" />
          <div className="w-3 h-3 rounded-sm bg-amber-500" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400" />
          <span>fully cleared</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Current streak" value={`${streak}d`} icon={Flame} accent="text-amber-400" />
        <StatCard label="DSA solved" value={`${totalDsaDone}/${totalDsaCount}`} icon={ListChecks} accent="text-emerald-400" />
        <StatCard label="Dev tasks done" value={`${totalDevDone}/${totalDevCount}`} icon={Code2} accent="text-cyan-400" />
        <StatCard label="Weekly tests logged" value={`${state.weeklyTests.length}`} icon={TrendingUp} accent="text-amber-400" />
      </div>

      <div>
        <h3 className="fs font-semibold text-slate-100 mb-2">Topic-wise DSA progress</h3>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          {DSA_TOPICS.map((topic) => {
            const done = topic.questions.filter((q) => state.completedDsa[q.id]).length;
            const pct = Math.round((done / topic.questions.length) * 100);
            return (
              <div key={topic.id}>
                <div className="flex justify-between fm text-xs text-slate-400 mb-1">
                  <span className="fs text-slate-300">{topic.name}</span>
                  <span>{done}/{topic.questions.length}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3">
      <Icon size={16} className={accent} />
      <p className="fm text-lg font-bold text-slate-50 mt-2">{value}</p>
      <p className="fs text-xs text-slate-500">{label}</p>
    </div>
  );
}
