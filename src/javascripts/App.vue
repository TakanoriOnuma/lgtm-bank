<template lang="pug">
div
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
      methods: 'GET',
      url: '/lgtm-image-urls'
    })
      .then((res) => {
        console.log(res);
        this.$data.imgUrls = res.data;
      });
  },
  methods: {
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
