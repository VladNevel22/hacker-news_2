<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CommentTree from './CommentTree.vue'

const route = useRoute()
const article = ref(null)
const isLoading = ref(false)
const containerRef = ref(null)

const commentKey = ref(0)
function reloadComments() {
	commentKey.value++
}

onMounted(async () => {
	try {
		isLoading.value = true
		const id = route.params.id
		const response = await fetch(
			`https://hacker-news.firebaseio.com/v0/item/${id}.json`
		)
		article.value = await response.json()
	} catch (err) {
		console.error('Ошибка при загрузке новости:', err)
	} finally {
		isLoading.value = false
	}
})
</script>

<template>
	<div class="article-container" ref="containerRef">
		<div v-if="article" class="article-content fade-in">
			<button @click="$router.push('/')" class="back-button">
				<span class="back-arrow">←</span>
				Назад ко всем новостям
			</button>

			<article class="article-card">
				<header class="article-header">
					<h1 class="article-title">{{ article.title }}</h1>
					<div class="article-meta-grid">
						<div class="meta-item">
							<div class="meta-icon"></div>
							<div class="meta-content">
								<span class="meta-label">Автор</span>
								<span class="meta-value">{{ article.by }}</span>
							</div>
						</div>

						<div class="meta-item">
							<div class="meta-icon"></div>
							<div class="meta-content">
								<span class="meta-label">Дата публикации</span>
								<span class="meta-value">{{
									new Date(article.time * 1000).toLocaleString()
								}}</span>
							</div>
						</div>

						<div class="meta-item">
							<div class="meta-icon"></div>
							<div class="meta-content">
								<span class="meta-label">Комментарии</span>
								<span class="meta-value">{{ article.descendants || 0 }}</span>
							</div>
						</div>

						<div class="meta-item" v-if="article.score">
							<div class="meta-icon"></div>
							<div class="meta-content">
								<span class="meta-label">Рейтинг</span>
								<span class="meta-value">{{ article.score }}</span>
							</div>
						</div>
					</div>
				</header>

				<a
					v-if="article.url"
					:href="article.url"
					target="_blank"
					class="original-link"
				>
					<span class="link-icon"></span>
					Перейти к оригинальной статье
					<span class="external-icon">↗</span>
				</a>

				<section class="comments-section">
					<div class="comments-header">
						<h2 class="comments-title">
							<span class="comments-icon"></span>
							Комментарии ({{ article.descendants || 0 }})
						</h2>

						<button
							@click="reloadComments"
							:disabled="isLoading"
							class="refresh-comments-btn"
						>
							<span v-if="!isLoading" class="button-content">
								<span class="icon">↻</span>
								Обновить
							</span>
							<span v-else class="button-content">
								<span class="spinner-small"></span>
								Загрузка...
							</span>
						</button>
					</div>

					<div class="comments-container">
						<CommentTree :key="commentKey" :commentIds="article.kids || []" />
					</div>
				</section>
			</article>
		</div>

		<div v-else class="loading-state">
			<div class="loading-spinner"></div>
			<p>Загрузка новости...</p>
		</div>
	</div>
</template>

<style scoped>
.article-container {
	max-width: 900px;
	margin: 0 auto;
	padding: 2rem;
	min-height: 100vh;
}

.back-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	background: white;
	color: #1e293b;
	border: 1px solid #e2e8f0;
	margin-bottom: 2rem;
	transition: all 0.3s ease;
	border-radius: 12px;
	padding: 0.75rem 1.5rem;
	font-weight: 600;
}

.back-button:hover {
	background: #f8fafc;
	transform: translateX(-4px);
	border-color: #2563eb;
}

.back-arrow {
	font-size: 1.2rem;
	transition: transform 0.3s ease;
}

.back-button:hover .back-arrow {
	transform: translateX(-2px);
}

.article-card {
	background: white;
	border-radius: 20px;
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	border: 1px solid #e2e8f0;
	overflow: hidden;
}

.article-header {
	padding: 2.5rem;
	background: linear-gradient(135deg, #f8fafc 0%, white 100%);
	border-bottom: 1px solid #e2e8f0;
}

.article-title {
	font-size: 2rem;
	font-weight: 700;
	line-height: 1.3;
	color: #1e293b;
	margin-bottom: 2rem;
}

.article-meta-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background: white;
	border-radius: 12px;
	border: 1px solid #e2e8f0;
	transition: all 0.3s ease;
}

.meta-item:hover {
	border-color: #2563eb;
	transform: translateY(-2px);
}

.meta-icon {
	font-size: 1.5rem;
	width: 3rem;
	height: 3rem;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	border-radius: 10px;
	color: white;
}

.meta-content {
	display: flex;
	flex-direction: column;
}

.meta-label {
	font-size: 0.8rem;
	color: #64748b;
	text-transform: uppercase;
	letter-spacing: 0.5px;
	font-weight: 600;
}

.meta-value {
	font-size: 1rem;
	font-weight: 600;
	color: #1e293b;
	margin-top: 0.25rem;
}

.original-link {
	display: inline-flex;
	align-items: center;
	gap: 0.75rem;
	padding: 1rem 1.5rem;
	margin: 2rem;
	background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
	color: white;
	border-radius: 12px;
	font-weight: 600;
	text-decoration: none;
	transition: all 0.3s ease;
	box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.original-link:hover {
	transform: translateY(-2px);
	box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
	gap: 1rem;
}

.link-icon,
.external-icon {
	font-size: 1.1rem;
	transition: transform 0.3s ease;
}

.original-link:hover .external-icon {
	transform: translate(2px, -2px);
}

.comments-section {
	padding: 2.5rem;
}

.comments-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
	flex-wrap: wrap;
	gap: 1rem;
}

.comments-title {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-size: 1.5rem;
	color: #1e293b;
	margin: 0;
}

.comments-icon {
	font-size: 1.3rem;
}

.refresh-comments-btn {
	background: white;
	color: #1e293b;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	padding: 0.75rem 1.5rem;
	font-weight: 600;
	transition: all 0.3s ease;
}

.refresh-comments-btn:hover:not(:disabled) {
	background: #2563eb;
	color: white;
	transform: translateY(-2px);
}

.comments-container {
	min-height: 200px;
}

.loading-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 4rem 2rem;
	gap: 1rem;
}

.loading-spinner {
	width: 48px;
	height: 48px;
	border: 3px solid #e2e8f0;
	border-top: 3px solid #2563eb;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

.spinner-small {
	width: 16px;
	height: 16px;
	border: 2px solid rgba(255, 255, 255, 0.3);
	border-top: 2px solid white;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

@media (max-width: 768px) {
	.article-container {
		padding: 1rem;
	}

	.article-header {
		padding: 1.5rem;
	}

	.article-title {
		font-size: 1.5rem;
	}

	.article-meta-grid {
		grid-template-columns: 1fr;
	}

	.comments-header {
		flex-direction: column;
		align-items: stretch;
	}

	.comments-section {
		padding: 1.5rem;
	}
}
</style>
