<template>
  <div class="hello">
    {{ msg }}   
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'HelloWorld'
    }
  },
  mounted(){
    this.$api.get('/personalized/newsong','', response => {
      if(response.data.code == 200){
         console.log(response,'接口搭建成功')
      }else{
        console.log('请求苏剧错误！')
      }    
})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
