import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import CandidatesListView from '../views/CandidatesListView.vue';
import CandidateDetailView from '../views/CandidateDetailView.vue';
import CurrentMandateView from '../views/CurrentMandateView.vue';
import ComparisonView from '../views/ComparisonView.vue';
import PollsAggregatorView from '../views/PollsAggregatorView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/pesquisas',
    name: 'PollsAggregator',
    component: PollsAggregatorView
  },
  {
    path: '/candidatos',
    name: 'CandidatesAll',
    component: CandidatesListView,
    props: { initialRole: 'all' }
  },
  {
    path: '/presidente',
    name: 'Presidente',
    component: CandidatesListView,
    props: { initialRole: 'presidente' }
  },
  {
    path: '/governador-sp',
    name: 'GovernadorSP',
    component: CandidatesListView,
    props: { initialRole: 'governador_sp' }
  },
  {
    path: '/senador',
    name: 'Senador',
    component: CandidatesListView,
    props: { initialRole: 'senador' }
  },
  {
    path: '/deputados-bauru',
    name: 'DeputadosBauru',
    component: CandidatesListView,
    props: { initialRole: 'deputado_federal_bauru' }
  },
  {
    path: '/candidato/:id',
    name: 'CandidateDetail',
    component: CandidateDetailView
  },
  {
    path: '/mandato-atual',
    name: 'CurrentMandate',
    component: CurrentMandateView
  },
  {
    path: '/comparador',
    name: 'Comparison',
    component: ComparisonView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

export default router;
