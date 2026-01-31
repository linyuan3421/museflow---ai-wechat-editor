/**
 * Comprehensive test script for knowledge base validation
 * Tests all queries from 指令.md against the expanded knowledge base
 */

const fs = require('fs');
const path = require('path');

// Load knowledge base data
const colors = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/colors.json'), 'utf8'));
const emotions = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/emotions.json'), 'utf8'));
const textures = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/textures.json'), 'utf8'));
const scenes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/scenes.json'), 'utf8'));
const structure = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/structure.json'), 'utf8'));
const techniques = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/knowledge/techniques.json'), 'utf8'));

const KNOWLEDGE_BASE = [
  ...colors,
  ...emotions,
  ...textures,
  ...scenes,
  ...structure,
  ...techniques
];

// Simple search function (keyword matching)
function searchKnowledge(query, topK = 5) {
  const queryLower = query.toLowerCase();
  
  const results = KNOWLEDGE_BASE
    .map(entry => {
      let score = 0;
      
      // Check keywords
      entry.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(queryLower)) {
          score += 2;
        }
      });
      
      // Check name
      if (entry.name.toLowerCase().includes(queryLower)) {
        score += 3;
      }
      
      // Check description
      if (entry.description.toLowerCase().includes(queryLower)) {
        score += 1;
      }
      
      return { ...entry, score };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  
  return results;
}

// Test queries from 指令.md
const testQueries = [
  // 🎨 经典设计流派
  'Swiss Style',
  'International Typographic Style',
  'Bauhaus',
  'Art Deco',
  'Brutalism',
  'Neo-Brutalism',
  'Vaporwave',
  'Synthwave',
  'Y2K',
  'Minimalism',
  'Victorian Style',
  
  // 🎞️ 电影与艺术指导
  'Wes Anderson',
  'Wong Kar-wai',
  'Hong Kong Neon',
  'Cyberpunk',
  'Studio Ghibli',
  'Monet',
  'Water Lilies',
  'Ukiyo-e',
  'Hokusai',
  
  // 🏯 东方美学与国潮
  '新中式',
  '宋体',
  '宋代',
  '敦煌',
  '昭和',
  '枯山水',
  '老上海',
  
  // 💼 行业与场景化
  'Tech Launch',
  'Apple',
  'Luxury',
  'Chanel',
  'Financial Times',
  'Coffee Shop',
  'Eco-Friendly',
  'Law Firm',
  'Mother & Baby',
  
  // 🌬️ 抽象感觉与自然
  'Petrichor',
  '雨后',
  'Golden Hour',
  '日落',
  'Deep Ocean',
  '深海',
  'Urban Loneliness',
  '城市孤独',
  'Morning Fog',
  '晨雾',
  'Old Bookstore',
  '旧书店',
  'Electric Energy',
  
  // 🌈 简单粗暴色卡
  'Morandi',
  'Dopamine',
  'Klein Blue',
  'Tiffany Blue',
  'Cream',
  'Sage Green'
];

console.log('='.repeat(80));
console.log('MuseFlow Knowledge Base - Comprehensive Test');
console.log('Testing all queries from 指令.md');
console.log('='.repeat(80));
console.log('');

let totalQueries = testQueries.length;
let queriesWithResults = 0;
let totalResults = 0;
let failedQueries = [];

const results = testQueries.map(query => {
  const searchResults = searchKnowledge(query, 3);
  const hasResults = searchResults.length > 0;
  
  if (hasResults) {
    queriesWithResults++;
    totalResults += searchResults.length;
  } else {
    failedQueries.push(query);
  }
  
  return {
    query,
    count: searchResults.length,
    results: searchResults
  };
});

// Display summary
console.log('📊 Test Summary');
console.log('='.repeat(80));
console.log(`Total queries tested: ${totalQueries}`);
console.log(`Queries with results: ${queriesWithResults} (${Math.round(queriesWithResults / totalQueries * 100)}%)`);
console.log(`Queries without results: ${failedQueries.length} (${Math.round(failedQueries.length / totalQueries * 100)}%)`);
console.log(`Total knowledge entries retrieved: ${totalResults}`);
console.log('');

// Display failed queries
if (failedQueries.length > 0) {
  console.log('⚠️  Queries without results:');
  console.log('='.repeat(80));
  failedQueries.forEach(query => {
    console.log(`  - ${query}`);
  });
  console.log('');
}

// Display successful results (top 20)
console.log('✅ Top 20 Successful Query Results:');
console.log('='.repeat(80));
results
  .filter(r => r.count > 0)
  .slice(0, 20)
  .forEach(({ query, count, results: r }) => {
    console.log(`\nQuery: "${query}"`);
    console.log(`Results: ${count} found`);
    r.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.name} (${result.type})`);
    });
  });

console.log('');
console.log('='.repeat(80));
console.log('✅ Test completed!');
console.log('='.repeat(80));

// Return exit code based on success rate
const successRate = queriesWithResults / totalQueries;
if (successRate >= 0.8) {
  console.log('✨ Excellent! Knowledge base coverage is strong.');
  process.exit(0);
} else if (successRate >= 0.6) {
  console.log('⚠️  Good, but there is room for improvement.');
  process.exit(0);
} else {
  console.log('❌ Knowledge base needs more entries.');
  process.exit(1);
}
