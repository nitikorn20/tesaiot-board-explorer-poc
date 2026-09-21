export const categories = Object.freeze({all:'All Examples',control:'Input & Control',sensors:'Sensors',audio:'Audio',dashboard:'Dashboard',connectivity:'Connectivity'});
export const boards = ['all','training','ndr'];
export const levels = ['all','beginner','intermediate','advanced'];
export function normalizeFilters(input = {}) {
  return { q:String(input.q || '').trim().slice(0,120), board:boards.includes(input.board)?input.board:'all', category:Object.hasOwn(categories,input.category)?input.category:'all', level:levels.includes(input.level)?input.level:'all' };
}
export function filterExamples(examples, input) {
  const state = normalizeFilters(input);
  const words = state.q.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return examples.filter(item => (state.board==='all' || item.board===state.board)
    && (state.category==='all' || item.category===state.category)
    && (state.level==='all' || item.difficulty===state.level)
    && words.every(word=>[item.title,item.subtitle,item.description,item.outcome,...item.tags,...item.hardware,...item.originalBoards,...(item.searchTerms||[])].join(' ').toLocaleLowerCase().includes(word)));
}
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
