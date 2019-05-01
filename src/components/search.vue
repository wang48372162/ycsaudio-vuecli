<template>
  <div class="search-wrapper">
    <button @click="show = true" class="button search-button" title="搜尋">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </button>

    <div v-if="show" class="search-block">
      <h2 class="search-title">搜尋</h2>
      <input v-model="search" ref="search" type="text" class="search-input" placeholder="搜尋...">

      <div v-if="result" class="search-result">
        <template v-if="result.audios.length">
          <h3>歌曲：</h3>
          <ul>
            <li v-for="audio in result.audios" :key="audio.id">
              <router-link :to="audioTo(audio.id)">
                {{ audio.title }}
              </router-link>

              <!-- Audio List link -->
              <router-link
                v-if="list && audioListTo(audio.id)"
                :to="audioTo(audio.id, true)"
                class="search-link-audio-list"
              >
                {{ list.name }}
              </router-link>
            </li>
          </ul>
        </template>

        <template v-if="result.lists.length">
          <h3>播放清單：</h3>
          <ul>
            <li v-for="list in result.lists" :key="list.id">
              <router-link :to="listTo(list.id)">
                {{ list.name }}
              </router-link>
            </li>
          </ul>
        </template>

        <div v-if="resultEmpty" class="search-none">
          搜尋不到任何歌曲或播放清單...
        </div>
      </div>

      <button @click="show = false" class="button search-button-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import { getAudios, getList, getLists, listContainAudio } from '../lib/util'

export default {
  name: 'Search',
  data() {
    return {
      show: false,
      search: ''
    }
  },
  watch: {
    $route() {
      this.show = false
      this.search = ''
    },
    show(show) {
      if (show) {
        this.$nextTick(() => {
          this.$refs.search.focus()
        })
      }
    }
  },
  computed: {
    result() {
      if (!this.search) {
        return
      }

      const audios = getAudios().filter(audio => {
        return this.searchText(this.search, audio.title)
      })
      const lists = getLists().filter(list => {
        return this.searchText(this.search, list.name)
      })

      return {
        audios,
        lists
      }
    },
    resultEmpty() {
      if (!this.result) return true
      return !this.result.audios.length && !this.result.lists.length
    },
    queryListId() {
      return this.$route.query && this.$route.query.list
    },
    list() {
      return this.queryListId ? getList(this.queryListId) : null
    }
  },
  methods: {
    searchText(key, text) {
      return String(text)
        .toLowerCase()
        .indexOf(key.toLowerCase()) !== -1
    },
    audioTo(id, useList = false) {
      const list = this.audioListTo(id)
      let query = { id }
      if (list && useList) {
        query.list = list
      }
      return { query }
    },
    listTo(list) {
      return {
        query: {
          list
        }
      }
    },
    audioListTo(audioId) {
      return listContainAudio(this.queryListId, audioId) ? this.queryListId : null
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/_mixin.scss';

.search-wrapper {
  position: relative;
  display: inline-block;
  margin-left: 0.75rem;
  text-align: left;
  vertical-align: bottom;
}
.search-title {
  text-align: center;
}
.search-button {
  position: absolute;
  bottom: 0;
  left: 0;
}
.search-button-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0;
}
.search-input {
  width: 16rem;
  max-width: 100%;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
}
.search-block {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 8px;
  right: -44px;
  z-index: 1000;
  padding: 1rem;
  background-color: $white;
  @include box-shadow();

  @media (max-width: 720px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .search-input {
      width: 100%;
    }
    .search-result {
      max-height: none;
    }
  }
}
.search-result {
  max-height: 25rem;
  margin: 1rem -1rem -1rem;
  overflow-x: hidden;
  overflow-y: auto;

  h3 {
    margin: 0 1rem 0.5rem;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 0.5rem;
  }
  li {
    padding: 0.5rem 1rem;
  }
  .search-none {
    color: $gray;
    text-align: center;
    padding: 0.5rem 1rem;
  }
}
.search-link-audio-list {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.85rem;
  color: $white;
  background: $primary;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
}
</style>
