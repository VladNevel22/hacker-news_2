import { createRouter, createWebHistory } from 'vue-router'
import NewsList from '../components/NewsList.vue'
import NewsItem from '../components/NewsItem.vue'

const routes = [
	{ path: '/', component: NewsList },
	{ path: '/news/:id', component: NewsItem, props: true },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
