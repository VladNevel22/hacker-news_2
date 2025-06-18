<script setup>
import { ref, onMounted, watch } from 'vue'
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

	const commentPromises = props.commentIds.map(async id => {
		const res = await fetch(
			`https://hacker-news.firebaseio.com/v0/item/${id}.json`
		)
		return await res.json()
	})

	comments.value = await Promise.all(commentPromises)
}

onMounted(loadComments)
</script>

<template>
	<ul>
		<li
			v-for="comment in comments"
			:key="comment.id"
			v-if="comment && !comment.deleted"
		>
			<div v-html="comment.text" class="comment-text" />
			<small>— {{ comment.by }}</small>

			<!-- Вложенные комментарии -->
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
</style>
