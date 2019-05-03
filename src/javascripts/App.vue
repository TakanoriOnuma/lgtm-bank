<template lang="pug">
div
  //- 画像のアップロード
  .image-upload
    input.image-upload__input-url(v-model="$data.uploadUrl", type="text", placeholder="画像URL")
    br
    select(v-model="$data.category")
      option(value="", disabled, selected, hidden) カテゴリ
      template(v-for="option in C.IMAGE_CATEGORY_OPTIONS")
        option(:value="option.value") {{ option.text }}
    br
    button(
      :disabled="$data.uploadUrl === '' || $data.category === ''"
      @click="onClickUploadButton"
    )
      | upload
  //- 画像の表示
  Tabs(:options="{ useUrlFragment: false }" @changed="onTabChanged")
    template(v-for="TAB in C.TAB_LIST")
      Tab(:id="TAB.id", :name="TAB.name")
        ul
          template(v-for="url in $data.imgUrls")
            li
              img(:src="url")
</template>

<script>
import axios from 'axios';

import { API_ROOT } from './constants/ApiRoot';
axios.defaults.baseURL = API_ROOT;
axios.defaults.timeout = 15000;

// components
import { Tabs, Tab } from 'vue-tabs-component';
import MyComponent from './components/MyComponent.vue';

// 画像のカテゴリ
const IMAGE_CATEGORY = {
  ANIME: 'anime',
  ANIMAL: 'animal',
  SCENERY: 'scenery',
  OTHER: 'other'
};

// タブリスト
const TAB_LIST = [
  { id: IMAGE_CATEGORY.ANIME, name: 'アニメ' },
  { id: IMAGE_CATEGORY.ANIMAL, name: '動物' },
  { id: IMAGE_CATEGORY.SCENERY, name: '風景' },
  { id: IMAGE_CATEGORY.OTHER, name: 'その他' },
];

export default {
  components: {
    Tabs,
    Tab,
    MyComponent
  },
  data() {
    this.C = {
      TAB_LIST,
      IMAGE_CATEGORY_OPTIONS: TAB_LIST.map((TAB) => ({
        value: TAB.id,
        text: TAB.name
      }))
    };
    return {
      uploadUrl: '',
      category: '',
      imgUrls: []
    };
  },
  created() {
    axios.request({
      method: 'GET',
      url: '/lgtm-image-urls'
    })
      .then((res) => {
        console.log(res);
        this.$data.imgUrls = res.data;
      });
  },
  methods: {
    /**
     * 画像のアップロードボタンを押したとき
     */
    onClickUploadButton() {
      console.log('uploading...');
      axios.request({
        method: 'POST',
        url: '/upload',
        data: {
          url: this.$data.uploadUrl,
          category: this.$data.category,
        }
      })
        .then(() => {
          console.log('success');
        });
    },
    /**
     * タブが切り替わったとき
     * @param {{ tab: VueComponent }} { tab } - 選択されたタブコンポーネント
     */
    onTabChanged({ tab }) {
      console.log(tab.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  width: 40px;
}

.sample {
  color: $red;
}

.image-upload {
  padding: 5px;

  &__input-url {
    width: 100%;
  }
}
</style>

<style lang="scss">
.tabs-component {
  margin: 4em 0;
}

.tabs-component-tabs {
  border: solid 1px #ddd;
  border-radius: 6px;
  margin-bottom: 5px;
}

@media (min-width: 700px) {
  .tabs-component-tabs {
    border: 0;
    align-items: stretch;
    display: flex;
    justify-content: flex-start;
    margin-bottom: -1px;
  }
}

.tabs-component-tab {
  color: #999;
  font-size: 14px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
}

.tabs-component-tab:not(:last-child) {
  border-bottom: dotted 1px #ddd;
}

.tabs-component-tab:hover {
  color: #666;
}

.tabs-component-tab.is-active {
  color: #000;
}

.tabs-component-tab.is-disabled * {
  color: #cdcdcd;
  cursor: not-allowed !important;
}

@media (min-width: 700px) {
  .tabs-component-tab {
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 3px 3px 0 0;
    margin-right: 0.5em;
    transform: translateY(2px);
    transition: transform 0.3s ease;
  }

  .tabs-component-tab.is-active {
    border-bottom: solid 1px #fff;
    z-index: 2;
    transform: translateY(0);
  }
}

.tabs-component-tab-a {
  align-items: center;
  color: inherit;
  display: flex;
  padding: 0.75em 1em;
  text-decoration: none;
}

.tabs-component-panels {
  padding: 4em 0;
}

@media (min-width: 700px) {
  .tabs-component-panels {
    border-top-left-radius: 0;
    background-color: #fff;
    border: solid 1px #ddd;
    border-radius: 0 6px 6px 6px;  // stylelint-disable-line
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    padding: 4em 2em;
  }
}
</style>

