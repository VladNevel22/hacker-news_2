<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CommentTree from './CommentTree.vue'

const route = useRoute()
const article = ref(null)
const isLoading = ref(false)

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
	<div class="container" v-if="article">
		<button @click="$router.push('/')">Назад ко всем новостям</button>
		<h2>{{ article.title }}</h2>
		<div class="meta">
			<p><strong>Автор:</strong> {{ article.by }}</p>
			<p>
				<strong>Дата:</strong>
				{{ new Date(article.time * 1000).toLocaleString() }}
			</p>
			<p><strong>Комментарии:</strong> {{ article.descendants || 0 }}</p>
		</div>
		<a class="original-link" :href="article.url" target="_blank"
			>Открыть оригинал</a
		>

		<h3>Комментарии</h3>
		<button @click="reloadComments" :disabled="isLoading">
			{{ isLoading ? 'Загрузка...' : 'Обновить комментарии' }}
		</button>
		<CommentTree :key="commentKey" :commentIds="article.kids || []" />
	</div>

	<div v-else>Загрузка...</div>
</template>

<style scoped>
.container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.meta {
	margin: 15px 0;
}

.original-link {
	display: inline-block;
	padding: 8px 15px;
	background: #646cff;
	color: white;
	border-radius: 5px;
	margin: 10px 0;
}

.original-link:hover {
	background: #535bf2;
}

button:disabled {
	opacity: 0.7;
	cursor: not-allowed;
}
</style>
