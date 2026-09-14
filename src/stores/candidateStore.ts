import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Candidate, RoleType, ScoreWeights, ScoreBreakdown } from '../types/candidate';
import { calculateCandidateScore, DEFAULT_WEIGHTS } from '../services/scoringEngine';
import { ALL_CANDIDATES, SUPPORTED_STATES, StateInfo } from '../data/registry';

export const useCandidateStore = defineStore('candidates', () => {
  // Estado
  const candidates = ref<Candidate[]>(ALL_CANDIDATES);
  const supportedStates = ref<StateInfo[]>(SUPPORTED_STATES);
  const selectedState = ref<string>('SP');
  
  // Recuperar pesos salvos ou usar padrão
  const savedWeights = localStorage.getItem('voto_consciente_weights');
  const weights = ref<ScoreWeights>(
    savedWeights ? JSON.parse(savedWeights) : { ...DEFAULT_WEIGHTS }
  );

  const selectedForComparison = ref<string[]>([]);
  const selectedRole = ref<RoleType | 'all'>('all');
  const searchQuery = ref<string>('');

  // Getters
  const scoredCandidates = computed(() => {
    return candidates.value.map(c => {
      const breakdown: ScoreBreakdown = calculateCandidateScore(c, weights.value);
      return {
        ...c,
        breakdown
      };
    });
  });

  const filteredCandidates = computed(() => {
    return scoredCandidates.value.filter(c => {
      // Presidente é federal (vale para todos os estados).
      // Se for governador, senador ou deputado, filtra pelo estado selecionado quando aplicável.
      const matchesState = c.role === 'presidente' || !c.state || c.state === selectedState.value;
      const matchesRole = selectedRole.value === 'all' || c.role === selectedRole.value;
      const query = searchQuery.value.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.popularName.toLowerCase().includes(query) ||
        c.party.toLowerCase().includes(query) ||
        (c.cityOrigin && c.cityOrigin.toLowerCase().includes(query));
      return matchesState && matchesRole && matchesSearch;
    }).sort((a, b) => b.breakdown.finalScore - a.breakdown.finalScore);
  });

  const comparisonCandidates = computed(() => {
    return scoredCandidates.value.filter(c => selectedForComparison.value.includes(c.id));
  });

  const currentPresident = computed(() => {
    return scoredCandidates.value.find(c => c.id === 'lula-presidente');
  });

  // Ações
  function updateWeights(newWeights: Partial<ScoreWeights>) {
    weights.value = { ...weights.value, ...newWeights };
    localStorage.setItem('voto_consciente_weights', JSON.stringify(weights.value));
  }

  function resetWeights() {
    weights.value = { ...DEFAULT_WEIGHTS };
    localStorage.removeItem('voto_consciente_weights');
  }

  function setSelectedState(uf: string) {
    selectedState.value = uf.toUpperCase();
  }

  function toggleComparison(candidateId: string) {
    const idx = selectedForComparison.value.indexOf(candidateId);
    if (idx >= 0) {
      selectedForComparison.value.splice(idx, 1);
    } else {
      if (selectedForComparison.value.length >= 3) {
        selectedForComparison.value.shift(); // Mantém no máximo 3
      }
      selectedForComparison.value.push(candidateId);
    }
  }

  function clearComparison() {
    selectedForComparison.value = [];
  }

  function getCandidateById(id: string) {
    return scoredCandidates.value.find(c => c.id === id);
  }

  function addCandidate(candidate: Candidate) {
    candidates.value.push(candidate);
  }

  return {
    candidates,
    supportedStates,
    selectedState,
    weights,
    selectedForComparison,
    selectedRole,
    searchQuery,
    scoredCandidates,
    filteredCandidates,
    comparisonCandidates,
    currentPresident,
    updateWeights,
    resetWeights,
    setSelectedState,
    toggleComparison,
    clearComparison,
    getCandidateById,
    addCandidate
  };
});
