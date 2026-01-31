/**
 * Test script for knowledge base search functionality
 * Tests the expanded knowledge base with sample queries
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

console.log('='.repeat(80));
console.log('MuseFlow Knowledge Base Test');
console.log('='.repeat(80));
console.log(`Total entries: ${KNOWLEDGE_BASE.length}`);
console.log('');

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

// Test queries
const testQueries = [
  '赛博朋克',
  '莫兰迪',
  '日本传统色',
  '孤独',
  '电影美学',
  '森林',
  '雨夜',
  '温暖'
];

console.log('Search Tests');
console.log('='.repeat(80));
console.log('');

testQueries.forEach(query => {
  const results = searchKnowledge(query, 3);
  console.log(`Query: "${query}"`);
  console.log(`Results: ${results.length} found`);
  
  results.forEach((result, index) => {
    console.log(`  ${index + 1}. ${result.name} (${result.type}) - Score: ${result.score}`);
    console.log(`     Description: ${result.description.substring(0, 60)}...`);
  });
  console.log('');
});

// Statistics
console.log('='.repeat(80));
console.log('Knowledge Base Statistics');
console.log('='.repeat(80));

const typeCount = {};
KNOWLEDGE_BASE.forEach(entry => {
  typeCount[entry.type] = (typeCount[entry.type] || 0) + 1;
});

console.log('');
Object.entries(typeCount).forEach(([type, count]) => {
  console.log(`  ${type}: ${count} entries`);
});

console.log('');
console.log('Total keywords:', KNOWLEDGE_BASE.reduce((sum, entry) => sum + entry.keywords.length, 0));
console.log('Average keywords per entry:', Math.round(KNOWLEDGE_BASE.reduce((sum, entry) => sum + entry.keywords.length, 0) / KNOWLEDGE_BASE.length * 10) / 10);
console.log('');
console.log('✅ All tests completed successfully!');
console.log('='.repeat(80));
