<template>
  <div class="card play-list">
    <router-link class="list-title" :to="listTitleTo">
      {{ title }}
    </router-link>

    <ul class="list-audios">
      <li v-for="audio in audioList" :key="audio.id">
        <router-link :to="audioTo(audio.id)" :class="linkClass(audio.id)">
          {{ audio.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getAudio } from '@/ycsaudio'

export default {
  name: 'Playlist',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    audios: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const route = useRoute()

    const listTitleTo = computed(() => {
      if (!props.id) {
        return {}
      }
      return {
        name: 'playlist',
        params: {
          playlist: props.id
        }
      }
    })

    const audioList = computed(() => {
      return props.audios.map(getAudio)
    })

    function audioTo(audioId) {
      return {
        name: 'audio',
        params: { audio: audioId },
        query: { list: props.id }
      }
    }

    function linkClass(id) {
      return {
        active: Number(id) === Number(route.params.audio)
      }
    }

    return {
      // Computed
      listTitleTo,
      audioList,

      // Method
      audioTo,
      linkClass
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/_variables.scss';

.play-list {
  .list-title {
    display: block;
    font-size: 1.2rem;
    padding: 0.75rem 1.25rem;
    margin: 0;
  }

  .list-audios {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      border-bottom: 1px solid rgba($primary, 20);
      &:last-child {
        border-bottom: 0px;
      }
    }

    a {
      display: block;
      padding: 0.75rem 1.25rem;
      text-decoration: none;
      color: $white;
      background: $primary;
      opacity: 0.8;
      transition: opacity $transition-duration;

      @mixin active {
        opacity: 1;
      }

      &.active {
        opacity: 0.9;
      }
      &:active {
        @include active;
      }
      @media only screen and (min-width: 480px) {
        &:hover {
          @include active;
        }
      }
    }
  }
}
</style>
