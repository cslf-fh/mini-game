<template>
  <div id="app">
    <div class="about">
      <span class="about__text" @click="modal = !modal">
        お借りした素材・ツール
      </span>
    </div>
    <div v-if="modal" class="modal" @click="modal = !modal">
      <div class="modal__overlay"></div>
      <div class="modal__window">
        <span class="modal__text modal__text--heading">
          お借りした素材・ツール
        </span>
        <span class="modal__text">画像</span>
        <ul class="modal__lists">
          <li><a :href="links.img" target="_blank">DOT ILLUST</a> 様</li>
        </ul>
        <span class="modal__text">音</span>
        <ul class="modal__lists">
          <li><a :href="links.se" target="_blank">OtoLogic</a> 様</li>
          <li>
            <a :href="links.bgm" target="_blank">Short VGM generator</a> 様
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    modal: false,
    links: {
      img: 'https://dot-illust.net/',
      se: 'https://otologic.jp/',
      bgm: 'https://abagames.itch.io/short-vgm-generator',
    },
  }),
};
</script>

<style lang="scss" scoped>
#app {
  font-family: 'DotGothic16';
}
.about {
  display: flex;
  justify-content: center;
  &__text {
    position: absolute;
    bottom: 16px;
    cursor: pointer;
  }
}
.modal {
  position: relative;
  &__overlay {
    position: fixed;
    width: 100vw;
    height: 100vh;
    margin: -8px;
    background-color: #000;
    opacity: 0.5;
  }
  &__window {
    display: flex;
    flex-direction: column;
    position: fixed;
    width: fit-content;
    height: fit-content;
    inset: 0;
    margin: auto;
    background-color: #fff;
  }
  &__text {
    margin: 16px;
    &--heading {
      font-size: 24px;
    }
  }
  &__lists {
    margin: 0;
    &:nth-child(odd) {
      margin-bottom: 16px;
    }
  }
}
</style>
