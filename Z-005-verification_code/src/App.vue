<template>
  <div id="app">
    <center>
      <verificationcode class="check_code"/>
    </center>
  </div>
</template>

<script>
import verificationcode from './components/verification_code.vue';

export default {
  name: 'App',
  components: {verificationcode}
}
</script>

<style>
.check_code{
  position: fixed;
  margin-top: 100px;
}
.beian{
    position: fixed;
    bottom: 15px;
    left: 50%;
    transform: translate(-50%, 0);
}
</style>
