<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import CommentTree from './CommentTree.vue'

function reloadComments() {
	commentKey.value++
}

const commentKey = ref(0)
const route = useRoute()
const article = ref(null)

// Загружаем новость по ID из URL
onMounted(async () => {
	const id = route.params.id
	const response = await fetch(
		`https://hacker-news.firebaseio.com/v0/item/${id}.json`
	)
	article.value = await response.json()
})
</script>

<template>
	<div v-if="article">
		<button @click="$router.push('/')">Назад ко всем новостям</button>
		<h2>{{ article.title }}</h2>
		<p>
			<strong>Автор:</strong> {{ article.by }}<br />
			<strong>Дата:</strong> {{ new Date(article.time * 1000).toLocaleString()
			}}<br />
			<strong>Комментарии:</strong> {{ article.descendants }}
		</p>
		<p>
			<a :href="article.url" target="_blank">Открыть оригинал</a>
		</p>

		<h3>Комментарии</h3>
		<button @click="reloadComments">Обновить комментарии</button>

		<CommentTree :key="commentKey" :commentIds="article.kids" />
	</div>
	<div v-else>Загрузка...</div>
</template>
