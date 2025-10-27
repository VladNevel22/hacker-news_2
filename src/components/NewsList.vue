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
	<div class="container fade-in">
		<div class="header">
			<div class="title-section">
				<h1>Последние новости Hacker News</h1>
				<p class="subtitle">Актуальные IT-новости в реальном времени</p>
			</div>

			<div class="stats-section">
				<div class="stat-card">
					<div class="stat-number">{{ newsStore.articles.length }}</div>
					<div class="stat-label">новостей</div>
				</div>
			</div>
		</div>

		<div class="controls">
			<button
				@click="refreshNews"
				:disabled="isRefreshing"
				class="refresh-button ripple"
			>
				<span v-if="!isRefreshing" class="button-content">
					<span class="icon">↻</span>
					Обновить
				</span>
				<span v-else class="loading button-content">
					<span class="spinner"></span>
					Загрузка...
				</span>
			</button>

			<div class="auto-refresh">
				<span class="info-text">Автообновление каждые 60 секунд</span>
			</div>
		</div>

		<div class="news-list">
			<div
				v-if="newsStore.articles.length === 0 && !isRefreshing"
				class="empty-state"
			>
				<div class="empty-icon">📰</div>
				<h3>Новостей пока нет</h3>
				<p>Нажмите "Обновить", чтобы загрузить последние новости</p>
			</div>

			<ul>
				<li
					v-for="(article, index) in newsStore.articles"
					:key="article.id"
					@click="$router.push(`/news/${article.id}`)"
					class="news-item ripple"
					:style="{ 'animation-delay': `${index * 0.1}s` }"
				>
					<div class="article-header">
						<h3 class="article-title">
							{{ article.title || 'Без заголовка' }}
						</h3>
						<div class="score-badge" v-if="article.score">
							▲ {{ article.score }}
						</div>
					</div>

					<div class="meta">
						<span class="meta-item">
							<span class="meta-icon">Автор</span>
							{{ article.by }}
						</span>
						<span class="meta-item">
							<span class="meta-icon">Дата:</span>
							{{ new Date(article.time * 1000).toLocaleString() }}
						</span>
						<span class="meta-item">
							<span class="meta-icon">Комментарии: </span>
							{{ article.descendants || 0 }}
						</span>
					</div>

					<div class="hover-indicator">
						<span class="arrow">→</span>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.container {
	max-width: 900px;
	margin: 0 auto;
	padding: 2rem;
	min-height: 100vh;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 2rem;
	gap: 2rem;
}

.title-section h1 {
	font-size: 2.5rem;
	margin-bottom: 0.5rem;
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
	font-weight: 700;
}

.subtitle {
	color: #64748b;
	font-size: 1.1rem;
}

.stats-section {
	display: flex;
	gap: 1rem;
}

.stat-card {
	background: white;
	padding: 1rem 1.5rem;
	border-radius: 12px;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	text-align: center;
	border: 1px solid #e2e8f0;
}

.stat-number {
	font-size: 2rem;
	font-weight: 700;
	color: #2563eb;
	line-height: 1;
}

.stat-label {
	font-size: 0.875rem;
	color: #64748b;
	margin-top: 0.25rem;
}

.controls {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	padding: 1.5rem;
	background: white;
	border-radius: 16px;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
	border: 1px solid #e2e8f0;
}

.refresh-button {
	min-width: 140px;
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	color: white;
	border: none;
	border-radius: 12px;
	padding: 0.75rem 1.5rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.refresh-button:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.refresh-button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
	transform: none;
	background: #64748b;
}

.button-content {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.info-text {
	color: #64748b;
	font-size: 0.9rem;
}

.news-list {
	position: relative;
}

.empty-state {
	text-align: center;
	padding: 4rem 2rem;
	background: white;
	border-radius: 16px;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	border: 2px dashed #e2e8f0;
}

.empty-icon {
	font-size: 3rem;
	margin-bottom: 1rem;
	color: #2563eb;
}

.empty-state h3 {
	color: #1e293b;
	margin-bottom: 0.5rem;
}

.empty-state p {
	color: #64748b;
}

ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 1rem;
}

.news-item {
	background: white;
	border-radius: 16px;
	padding: 1.5rem;
	cursor: pointer;
	transition: all 0.3s ease;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	border: 1px solid #e2e8f0;
	position: relative;
	overflow: hidden;
	animation: fadeInUp 0.6s ease-out both;
}

.news-item::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	width: 4px;
	height: 100%;
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	opacity: 0;
	transition: opacity 0.3s ease;
}

.news-item:hover {
	transform: translateY(-4px);
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.news-item:hover::before {
	opacity: 1;
}

.article-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 1rem;
	margin-bottom: 1rem;
}

.article-title {
	flex: 1;
	margin: 0;
	font-size: 1.1rem;
	line-height: 1.4;
	color: #1e293b;
	font-weight: 600;
}

.score-badge {
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	color: white;
	padding: 0.25rem 0.75rem;
	border-radius: 20px;
	font-size: 0.8rem;
	font-weight: 600;
	white-space: nowrap;
}

.meta {
	display: flex;
	gap: 1.5rem;
	flex-wrap: wrap;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.875rem;
	color: #64748b;
}

.meta-icon {
	font-size: 0.8rem;
	color: #2563eb;
}

.hover-indicator {
	position: absolute;
	top: 50%;
	right: 1.5rem;
	transform: translateY(-50%);
	opacity: 0;
	transition: all 0.3s ease;
	color: #2563eb;
	font-weight: bold;
}

.news-item:hover .hover-indicator {
	opacity: 1;
	transform: translateY(-50%) translateX(4px);
}

@keyframes fadeInUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.loading {
	display: flex;
	align-items: center;
	gap: 0.5rem;
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

@media (max-width: 768px) {
	.container {
		padding: 1rem;
	}

	.header {
		flex-direction: column;
		text-align: center;
	}

	.controls {
		flex-direction: column;
		gap: 1rem;
		text-align: center;
	}

	.meta {
		flex-direction: column;
		gap: 0.5rem;
	}

	.article-header {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>
