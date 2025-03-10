<script setup lang="ts">
import { useToning } from "../src/hooks/use-toning";
import img from "/imge.jpg";
import { onMounted, ref } from "vue";

const imgUrl = ref(img);

const { brightnessData, changeImgBrightness, convertImageToBase64 } =
  useToning();

onMounted(() => {
  convertImageToBase64(img).then((base64: any) => {
    brightnessData.value.originalImg = base64;
  });
});
brightnessData.value.originalImg = img;

const change = () => {
  changeImgBrightness(brightnessData.value.attr, (img) => {
    imgUrl.value = img;
  });
};
</script>
<style scoped lang="scss">
.label {
  flex-shrink: 0;
  width: 42px;
  margin-right: 16px;
  font-size: 14px;
  line-height: 24px;
  color: #989aae;
  text-align: right;
}
</style>

<template>
  <div style="margin-bottom: 20px">
    <a href="https://github.com/huyougu" target="_blank">
      <img
        :src="imgUrl"
        class="logo vue"
        alt="Vue logo"
        style="width: 200px; height: 200px"
      />
    </a>
  </div>
  <div
    style="display: flex; align-items: center; width: 420px; margin-top: 12px"
    v-for="item in brightnessData.attr"
    :key="item.key"
  >
    <label for="brightness" style="width: 42px" class="label">{{
      item.name
    }}</label>
    <el-slider
      id="brightness"
      v-model="item.value"
      show-input
      :min="item.key == 'blur' || item.key == 'opacity' ? 0 : -100"
      :max="100"
      @change="change()"
    />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
