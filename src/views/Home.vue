<template>
  <div class="background">
<!--    <img :src="bgImg" width="100%" height="100%">-->
  </div>

  <div class="homepage">
    <div class="container">
      <h1 class="title" id="title" v-on:click="goToEvent()" style="color: white; font-weight: bold">
        Events
      </h1>
<!--      <h5 class="subtitle" id="subtitle " style="color: white; text-decoration: underline">-->
<!--        Events for everyone.-->
<!--      </h5>-->
      <div>
        <div id="content">
          <button v-if="status === null"
              type="button" class="btn btn-light btn-lg" v-on:click="goToRegister()">
            Register
          </button>
          <button v-if="status != null"
                  type="button" class="btn btn-light btn-lg" disabled>
            Register
          </button>
          <button v-if="status === null"
              type="button" class="btn btn-light btn-lg" v-on:click="goToLogin()">
            Login
          </button>
          <button v-if="status != null"
                  type="button" class="btn btn-light btn-lg" disabled>
            Login
          </button>
          <Login></Login>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//import Register from "@/views/Register";

export default {
  name: "Home.vue",
  //components: Register,
  data() {
    return{
      error: "",
      errorFlag: false,
      users: [],
      bgImg: require('../assets/background.png'),
      status:'',
    }
  },
  mounted() {
    this.status = sessionStorage.getItem('token')
  },
  methods: {
    goToRegister() {
      console.log(this.status);
      this.$router.push('/users/register');
    },
    goToLogin() {
      this.$router.push('/users/login');
    },
    goToEvent() {
      this.$router.push('/events');
    }
  }
}
</script>

<style scoped>
html,body{
  margin: 0;
  padding: 0;
}
.background{
  background: url("../assets/background.png");
  background-size: 100% 100%;
  width:100%;
  height:100%;
  position: fixed;
  top:0px;
}
.btn{
  width: 100px;
  height: 40px;
  font-size: 17px;
  margin-top: 50px;
  margin-left: 30px;
  margin-right: 20px;
}
.homepage{
  position: absolute;
  top:40%;
  -webkit-transform: translateY(-50%);
  left: 40%;
}
</style>