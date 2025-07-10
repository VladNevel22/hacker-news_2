<script setup>
import { ref, onMounted } from 'vue'
import CommentTree from './CommentTree.vue'

const props = defineProps({
	commentIds: {
		type: Array,
		default: () => [],
	},
})

const comments = ref([])

async function loadComments() {
	if (!props.commentIds || props.commentIds.length === 0) return

	try {
		const commentPromises = props.commentIds.map(async id => {
			const res = await fetch(
				`https://hacker-news.firebaseio.com/v0/item/${id}.json`
			)
			if (!res.ok) throw new Error(`Ошибка загрузки комментария ${id}`)
			return await res.json()
		})

		comments.value = (await Promise.all(commentPromises)).filter(
			comment => comment && !comment.deleted
		)
	} catch (err) {
		console.error('Ошибка при загрузке комментариев:', err)
	}
}

onMounted(loadComments)
</script>

<template>
	<ul>
		<li v-for="comment in comments" :key="comment.id">
			<div v-html="comment.text" class="comment-text" />
			<small>— {{ comment.by }}</small>

			<CommentTree v-if="comment.kids" :commentIds="comment.kids" />
		</li>
	</ul>
</template>

<style scoped>
.comment-text {
	margin: 10px 0;
	padding-left: 10px;
	border-left: 2px solid #ccc;
}

ul {
	list-style: none;
	padding-left: 10px;
}

li {
	margin: 15px 0;
}
</style>
