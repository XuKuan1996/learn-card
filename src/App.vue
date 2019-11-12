<template>
  <div id="app">
    <Menu @select="handleMenuSelect" />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Menu from "./components/menu.vue";
import Vue from 'vue';

export default {
  name: "app",
  components: {
    HelloWorld,
    Menu
  },
  methods: {
    handleMenuSelect(name){
      try{
        this.$router.replace(name);
      }catch{
        console.log('test');
      }
    }
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
}
.content {
  padding: 20px;
  text-align: center;
  width: 80vw;
  overflow: auto;
  max-height: 100vh;
}
</style>
