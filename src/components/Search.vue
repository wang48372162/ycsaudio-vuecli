<template>
  <div class="search-wrapper">
    <button @click="open" class="button search-button" title="搜尋 (Enter)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </button>

    <div v-if="show" class="search-block">
      <h2 class="search-title">搜尋</h2>
      <input
        v-model="search"
        ref="searchRef"
        type="text"
        class="search-input"
        placeholder="搜尋..."
        @keydown.prevent.down="searchKeydown"
        @keydown.prevent.up="searchKeyup"
        @keydown.enter="searchEnter"
      >

      <div v-if="result" ref="searchResult" class="search-result">
        <template v-if="result.audios.length">
          <h3>歌曲：</h3>
          <ul>
            <li
              v-for="(audio, i) in result.audios"
              :key="audio.id"
              :ref="el => { searchResultAudiosRefs[i] = el }"
            >
              <router-link
                :to="audioTo(audio.id)"
                :class="getLinkClass(i, selectAudioIndex)"
                @click="onClickLink"
              >
                {{ audio.title }}

                <!-- Audio List link -->
                <router-link
                  v-if="currentList && audioListTo(audio.id)"
                  :to="audioTo(audio.id, true)"
                  class="search-link-audio-list"
                  @click="onClickLink"
                >
                  {{ currentList.name }}
                </router-link>
              </router-link>
            </li>
          </ul>
        </template>

        <template v-if="result.lists.length">
          <h3>播放清單：</h3>
          <ul>
            <li
              v-for="(list, i) in result.lists"
              :key="list.id"
              :ref="el => { searchResultListsRefs[i] = el }"
            >
              <router-link
                :to="listTo(list.id)"
                :class="getLinkClass(i, selectListIndex)"
                @click="onClickLink"
              >
                {{ list.name }}
              </router-link>
            </li>
          </ul>
        </template>

        <div v-if="resultEmpty" class="search-none">
          搜尋不到任何歌曲或播放清單...
        </div>
      </div>

      <button @click="show = false" class="button search-button-close" title="關閉 (Escape)">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick, onBeforeUpdate } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAudios, getList, getLists, listContainAudio } from '@/ycsaudio'
import { hotkey, excludeHotkeyArea } from '@/modules/hotkey'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const show = ref(false)
    const search = ref('')
    const selectIndex = ref(null)
    const searchRef = ref(null)
    const searchResultAudiosRefs = ref([])
    const searchResultListsRefs = ref([])

    const result = computed(() => {
      if (!search.value) {
        return
      }

      const audios = getAudios().filter(audio => {
        return searchText(search.value, audio.title)
      })
      const lists = getLists().filter(list => {
        return searchText(search.value, list.name)
      })

      return { audios, lists }
    })

    const resultEmpty = computed(() => {
      if (!result.value) {
        return true
      }
      return !result.value.audios.length && !result.value.lists.length
    })

    const selectAudioIndex = computed(() => {
      if (!result.value) {
        return null
      }
      if (selectIndex.value >= result.value.audios.length) {
        return null
      }
      return selectIndex.value
    })

    const selectAudio = computed(() => selectAudioIndex.value !== null
      ? result.value.audios[selectAudioIndex.value] : null)

    const selectAudioEl = computed(() => selectAudioIndex.value !== null
      ? searchResultAudiosRefs.value[selectAudioIndex.value] : null)

    const selectListIndex = computed(() => {
      if (!result.value) {
        return null
      } else if (selectIndex.value < result.value.audios.length) {
        return null
      }
      return selectIndex.value - result.value.audios.length
    })

    const selectList = computed(() => selectListIndex.value !== null
      ? result.value.lists[selectListIndex.value] : null)

    const selectListEl = computed(() => selectListIndex.value !== null
      ? searchResultListsRefs.value[selectListIndex.value] : null)

    const queryListId = computed(() => route.name === 'playlist'
      ? route.params.playlist
      : (route.query && route.query.list))

    const currentList = computed(() => queryListId.value
      ? getList(queryListId.value) : null)

    const selectLinkRoute = computed(() => {
      if (!result.value) {
        return null
      } else if (selectAudio.value) {
        return audioTo(selectAudio.value.id)
      } else if (selectList.value) {
        return listTo(selectList.value.id)
      }
      return null
    })

    function open() {
      show.value = true
    }

    function close() {
      show.value = false
    }

    function toggle() {
      show.value = !show.value
    }

    function searchText(key, text) {
      return String(text)
        .toLowerCase()
        .indexOf(key.toLowerCase()) !== -1
    }

    function getLinkClass(index, selectIndex) {
      return {
        active: index === selectIndex
      }
    }

    function selectScrollIntoView() {
      const options = {
        block: 'nearest'
      }
      if (selectAudio.value && selectAudioEl.value) {
        selectAudioEl.value.scrollIntoView(options)
      } else if (selectList.value && selectListEl.value) {
        selectListEl.value.scrollIntoView(options)
      }
    }

    function audioListTo(audioId) {
      return listContainAudio(queryListId.value, audioId) ? queryListId.value : null
    }

    function audioTo(id, useList = false) {
      const list = audioListTo(id)
      return {
        name: 'audio',
        params: { audio: id },
        query: list && useList ? { list } : {}
      }
    }

    function listTo(listId) {
      return {
        name: 'playlist',
        params: {
          playlist: listId
        }
      }
    }

    function onClickLink() {
      show.value = false
      search.value = ''
      selectIndex.value = null
    }

    function searchEnter() {
      const targetRoute = selectLinkRoute.value
      if (selectIndex.value !== null && targetRoute) {
        onClickLink()
        router.push(targetRoute)
      }
    }

    function searchKeydown() {
      if (!result.value) {
        return null
      }

      const resultsLength = result.value.audios.length + result.value.lists.length
      if (selectIndex.value === null) {
        selectIndex.value = 0
      } else if (selectIndex.value < (resultsLength - 1)) {
        selectIndex.value++
      }

      selectScrollIntoView()
    }

    function searchKeyup() {
      if (!result.value) {
        return null
      }

      if (selectIndex.value > 0) {
        selectIndex.value--
      }

      selectScrollIntoView()
    }

    watch(show, show => {
      if (show) {
        nextTick(() => searchRef.value.focus())
      }
    })

    watch(search, search => {
      if (search === '' || search === null) {
        selectIndex.value = null
      } else {
        selectIndex.value = (result.value.audios.length + result.value.lists.length > 0) ? 0 : null
      }
    })

    onBeforeUpdate(() => {
      searchResultAudiosRefs.value = []
      searchResultListsRefs.value = []
    })

    excludeHotkeyArea('input.search-input', () => {
      hotkey('Enter', open)
    })
    hotkey('Escape', close)

    return {
      // Refs
      show,
      search,
      selectIndex,
      searchRef,
      searchResultAudiosRefs,
      searchResultListsRefs,

      // Computed
      result,
      resultEmpty,
      selectAudioIndex,
      selectAudio,
      selectAudioEl,
      selectListIndex,
      selectList,
      selectListEl,
      queryListId,
      currentList,
      selectLinkRoute,

      // Methods
      open,
      close,
      toggle,
      searchText,
      getLinkClass,
      selectScrollIntoView,
      audioListTo,
      audioTo,
      listTo,
      onClickLink,
      searchEnter,
      searchKeydown,
      searchKeyup
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixin.scss';

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
  position: relative;
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
  a:not(.search-link-audio-list) {
    display: block;
    padding: 0.5rem 1rem;
    &:hover {
      background: darken($white, 5%);
    }
    &.active {
      color: $white;
      background: $primary;
      .search-link-audio-list {
        color: $primary;
        background: $white;
      }
    }
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
