<template>
  <div class="card play-list">
    <router-link class="list-title" :to="listTitleTo">
      {{ title }}
    </router-link>

    <ul class="list-audios">
      <li v-for="audio in audioList" :key="audio.id">
        <router-link :to="audioTo(audio.id)" :class="linkCls(audio.id)">
          {{ audio.title }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getAudio } from '@/lib/util'

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
  computed: {
    listTitleTo() {
      return {
        query: {
          list: this.id
        }
      }
    },
    audioList() {
      return this.audios.map(getAudio)
    }
  },
  methods: {
    audioTo(id) {
      return {
        query: {
          id,
          list: this.id
        }
      }
    },
    linkCls(id) {
      return {
        active: id === this.$route.query.id
      }
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
