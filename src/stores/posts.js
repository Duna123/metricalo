// src/store/posts.js
import { defineStore } from 'pinia'
import api from '../services/api'

const PAGE_SIZE = 10

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    currentPage: 1,
    totalPages: 1,
    users: [],
    selectedUser: null
  }),
  getters: {
    computedCurrentPage: (state) => state.currentPage
  },
  actions: {
    async fetchPosts (page) {
      const params = {
        _page: page,
        _limit: PAGE_SIZE
      }
      if (this.selectedUser) {
        params.userId = this.selectedUser
        params._page = 1
        this.currentPage = 1
      }
      try {
        const response = await api.get('/posts?', {
          params
        })
        this.posts = response.data
        this.totalPages = Math.ceil(response.headers['x-total-count'] / PAGE_SIZE)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    },
    async fetchUsers () {
      try {
        const response = await api.get('/users')
        this.users = response.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    },
    async createPost (post) {
      try {
        const response = await api.post('/posts', post)
        this.posts.push(response.data)
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    },
    async updatePost (post) {
      try {
        await api.put(`/posts/${post.id}`, post)
        const index = this.posts.findIndex(p => p.id === post.id)
        if (index !== -1) {
          this.posts[index] = post
        }
      } catch (error) {
        console.error('Failed to update post:', error)
        throw error
      }
    },
    async deletePost (postId) {
      try {
        await api.delete(`/posts/${postId}`)
        this.posts = this.posts.filter(p => p.id !== postId)
      } catch (error) {
        console.error('Failed to delete post:', error)
      }
    }
  }
})
