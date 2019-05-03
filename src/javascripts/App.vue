<template lang="pug">
div
  ul
    template(v-for="url in $data.imgUrls")
      li
        img(:src="url")
  button(@click="onClickUploadButton") upload
</template>

<script>
import axios from 'axios';

import { API_ROOT } from './constants/ApiRoot';
axios.defaults.baseURL = API_ROOT;
axios.defaults.timeout = 15000;

// components
import MyComponent from './components/MyComponent.vue';

export default {
  components: {
    MyComponent
  },
  data() {
    return {
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
    onClickUploadButton() {
      axios.request({
        method: 'POST',
        url: '/upload',
        data: {
          url: 'https://lgtmoon.herokuapp.com/images/10150',
          category: 'anime'
        }
      });
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
</style>
