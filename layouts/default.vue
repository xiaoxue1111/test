<template>
  <div>
    <nuxt/>
  </div>
</template>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  word-spacing: .01rem;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
body{
  font-size:.16rem;
}
a{text-decoration:none}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
ol,ul{
  list-style: none;
}

.q{
  width: .16rem;
  height: .16rem;
  border-radius:.16rem;
  background: #7064B3;
  border:.01rem solid #B3A6FF;
  font-size: .12rem;
  text-align: center;
  cursor: pointer;
  line-height: .16rem;
  margin-left:.08rem;
  padding:0;
  color: #B3A6FF;
}
.q:hover{
    background-color: #7064B3;
    color: #B3A6FF;
    border-color:#B3A6FF;
 }
</style>
