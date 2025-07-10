<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useNewsStore } from '/stores/news'

const newsStore = useNewsStore()
const intervalId = ref(null)
const isRefreshing = ref(false)

const refreshNews = async () => {
	try {
		isRefreshing.value = true
		await newsStore.fetchNews()
	} finally {
		isRefreshing.value = false
	}
}

onMounted(() => {
	refreshNews()
	intervalId.value = setInterval(refreshNews, 60000)
})

onUnmounted(() => {
	if (intervalId.value) clearInterval(intervalId.value)
})
</script>

<template>
	<div class="container">
		<h1>Последние новости Hacker News</h1>
		<p>Количество новостей: {{ newsStore.articles.length }}</p>

		<button
			@click="refreshNews"
			:disabled="isRefreshing"
			class="refresh-button"
		>
			<span v-if="!isRefreshing">Обновить</span>
			<span v-else class="loading">
				<span class="spinner"></span>
				Загрузка...
			</span>
		</button>

		<ul>
			<li
				v-for="article in newsStore.articles"
				:key="article.id"
				@click="$router.push(`/news/${article.id}`)"
			>
				<h3>{{ article.title || 'Без заголовка' }}</h3>
				<div class="meta">
					<span>Автор: {{ article.by }}</span>
					<span
						>Дата: {{ new Date(article.time * 1000).toLocaleString() }}</span
					>
					<span>Комментарии: {{ article.descendants || 0 }}</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}
.refresh-button {
	position: relative;
	min-width: 100px;
}

.loading {
	display: flex;
	align-items: center;
	gap: 8px;
}

.spinner {
	width: 16px;
	height: 16px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	border-top-color: white;
	animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
	background-color: grey;
}
li {
	cursor: pointer;
	width: 100%;
}

.meta {
	display: flex;
	gap: 15px;
	margin-top: 8px;
	font-size: 0.9em;
	color: #666;
}
</style>
