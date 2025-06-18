import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NewsList from '../NewsList.vue'
import { createTestingPinia } from '@pinia/testing'

describe('NewsList.vue', () => {
	it('отображает 100 новостей из хранилища', () => {
		const wrapper = mount(NewsList, {
			global: {
				plugins: [
					createTestingPinia({
						createSpy: vi.fn, // <--- ВАЖНО
						stubActions: false,
						initialState: {
							news: {
								articles: Array.from({ length: 100 }, (_, i) => ({
									id: i,
									title: `Новость #${i + 1}`,
								})),
							},
						},
					}),
				],
			},
		})

		const items = wrapper.findAll('li')
		expect(items.length).toBe(100)
	})
})
