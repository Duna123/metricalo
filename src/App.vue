<!-- src/App.vue -->
<template>
   <div class="q-pa-md">
    <q-select v-model="selectedUser" :options="userOptions"   @change="onSelected">
    </q-select>

    <h2>Posts</h2>
    <div class="posts-container">
      <div v-if="postsStore.posts.length === 0">Loading posts...</div>
      <q-list v-else>
        <q-item v-for="post in postsStore.posts" :key="post.id" class="post-item">
          <q-item-section>
            <div class="form-group">
              <q-input v-model="post.title" type="text" :readonly="post.isUpdating" />
            </div>
            <div class="form-group">
              <q-input v-model="post.body" type="text" :readonly="post.isUpdating" />
            </div>
          </q-item-section>
          <q-item-section side>
            <q-btn @click="updatePost(post)" :disable="post.isUpdating">Update</q-btn>
            <q-btn @click="deletePost(post.id)">Delete</q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="pagination">
        <q-btn @click="previousPage" :disable="computedCurrentPage === 1">Previous</q-btn>
        <span>{{ postsStore.computedCurrentPage }} / {{ postsStore.totalPages }}</span>
        <q-btn @click="nextPage" :disable="computedCurrentPage === postsStore.totalPages">Next</q-btn>
      </div>
    </div>

    <h2>Create Post</h2>
    <q-form @submit.prevent="createPost">
      <q-input v-model="newPost.title"  label="Title" required />
      <q-input v-model="newPost.body"  label="Body" required />
      <q-btn type="submit" label="Create"></q-btn>
    </q-form>
  </div>

</template>

<script>
import { usePostsStore } from './stores/posts'
import { provide, ref, onMounted, computed, watch } from 'vue'
import { createPinia } from 'pinia'

export default {
  setup () {
    const pinia = createPinia()
    provide(pinia)
    const postsStore = usePostsStore()

    const newPost = ref({
      title: '',
      body: ''
    })
    const userOptions = computed(() => {
      return [
        { label: 'All Users', value: '' },
        ...postsStore.users.map((user) => ({
          label: user.name,
          value: user.id
        }))
      ]
    })
    const computedCurrentPage = computed(() => postsStore.computedCurrentPage)
    const createPost = () => {
      if (!newPost.value.title || !newPost.value.body) {
        console.log('Please enter a title and body.')
        return
      }
      postsStore.createPost(newPost.value)
      newPost.value.title = ''
      newPost.value.body = ''
    }

    const updatePost = (post) => {
      if (!post.title || !post.body) {
        console.log('Please enter a title and body.')
        return
      }

      post.isUpdating = true
      postsStore.updatePost(post)
        .then(() => {
          post.isUpdating = false
        })
        .catch(() => {
          post.isUpdating = false
        })
    }
    const deletePost = (postId) => {
      postsStore.deletePost(postId)
    }

    const nextPage = () => {
      if (computedCurrentPage.value < postsStore.totalPages) {
        postsStore.currentPage++
        fetchPosts()
      }
    }

    const previousPage = () => {
      if (computedCurrentPage.value > 1) {
        postsStore.currentPage--
        fetchPosts()
      }
    }
    const fetchUsers = () => {
      postsStore.fetchUsers()
    }
    const selectedUser = ref('')

    const fetchPosts = () => {
      postsStore.selectedUser = selectedUser.value.value
      postsStore.currentPage = computedCurrentPage.value
      postsStore.fetchPosts(computedCurrentPage.value)
    }

    const onSelected = () => {
      postsStore.selectedUser = selectedUser.value
      fetchPosts()
    }

    onMounted(() => {
      postsStore.fetchUsers()
      fetchPosts()
    })
    watch(selectedUser, fetchPosts, computedCurrentPage)
    return { postsStore, newPost, userOptions, selectedUser, onSelected, fetchPosts, createPost, deletePost, updatePost, nextPage, previousPage, fetchUsers }
  }

}
</script>

<style>
/* select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto;
  }
  .container {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .posts-container {
  flex-direction: column;
  align-items: center;
}

.post-item {
  margin-bottom: 20px;
}

.post-details {
  text-align: center;
}

.form-group {
  display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto;
}

.form-group label {
  padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.form-group input {
  padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.post-actions button {
  padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
}
  option {
    font-size: 16px;
  }
form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: 0 auto;
  }

  input[type="text"] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button[type="submit"] {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button[type="submit"]:hover {
    background-color: #45a049;
  } */
</style>
