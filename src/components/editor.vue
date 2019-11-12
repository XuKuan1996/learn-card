<template>
  <div>
    <div ref="editor" style="text-align: left;" class="editor"></div>
    <button v-on:click="getContent">查看内容</button>
  </div>
</template>

<script>
import E from 'wangeditor';
export default {
  data: function(){
    return {
      editorContent: '',
    };
  },
  mounted(){
    const editor = new E(this.$refs.editor);
    editor.customConfig.onchange = (html) => {
      this.editorContent = html;
      this.$emit('getContent', html);
    };
    editor.customConfig.uploadImgShowBase64 = true;
    editor.customConfig.zIndex = 1;
    editor.create();
    console.log(editor)
    editor.$textElem[0].innerHTML = this.initContent // 编辑时初始化内容
  },
  methods: {
    getContent(){
      console.log(this.editorContent);
      // this.$emit('')
    }
  },
  props: ['init-content'],
  updated(){
    console.log('updated', this['init-content'])
  }
};
</script>

<style scoped>
</style>