<template>
  <div class="editBox">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
      <el-menu-item index="1">Home</el-menu-item>
      <el-submenu index="2">
        <template #title>User</template>
        <el-menu-item index="2-1" disabled>Register</el-menu-item>
        <el-menu-item index="2-2" disabled>Login</el-menu-item>
        <el-menu-item index="2-3">Profile</el-menu-item>
        <el-menu-item index="2-4">Logout</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template #title>Event</template>
        <el-menu-item index="3-1">View Events</el-menu-item>
        <div v-if="status != null">
          <el-menu-item index="3-2">Create Event</el-menu-item>
        </div>
        <div v-if="status == null">
          <el-menu-item index="3-2" disabled>Create Event</el-menu-item>
        </div>
      </el-submenu>
      <el-menu-item index="4">Mypage</el-menu-item>
    </el-menu>

    <div v-if="errorFlag" class= error style="color: #ff0000;">
      <el-alert class="el-alert" title="error alert" type="error" show-icon center :closable="false">{{ error }}</el-alert>
    </div>

    <el-form ref="form" class="edit" :model="form"  style="width: 600px; font-size: larger">
      <el-form-item label="First Name" >
        <el-input name="firstName" class="firstName" v-model="firstName" :placeholder="userInfo.firstName" width="100px"></el-input>
      </el-form-item>
      <el-form-item label="Last Name">
        <el-input name="lastName" class="lastName" v-model="lastName" :placeholder="userInfo.lastName"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input name="email" class="email" v-model="email" :placeholder="userInfo.email" prefix-icon="el-icon-message"></el-input>
      </el-form-item>
      <el-form-item label="New Password">
        <el-input :type="pwdFlag1 ? 'text' : 'password'" prefix-icon="el-icon-lock" v-model="password" placeholder="New Password"></el-input>
        <i :class="pwdFlag1?icon2:icon1" style="position: absolute; right: 0.7rem; top: 3.2rem; font-size: 20px" @click="pwdFlag1=!pwdFlag1"></i>
      </el-form-item>
      <el-form-item label="Current Password  (Only need when change password)">
        <el-input :type="pwdFlag2 ? 'text' : 'password'" prefix-icon="el-icon-lock" v-model="currentPassword" placeholder="Current Password"></el-input>
        <i :class="pwdFlag2?icon2:icon1" style="position: absolute; right: 0.7rem; top: 3.2rem; font-size: 20px" @click="pwdFlag2=!pwdFlag2"></i>
      </el-form-item>
      <el-form-item label="Profile Picture">
        <el-upload
            :class="{hide: uploadDisabled}"
            action="https://jsonplaceholder.typicode.com/posts/"
            accept=".jpeg,.png,.gif"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :on-change="putImage"
            :on-preview="handlePictureCardPreview"
        >
          <i class="el-icon-plus"></i>
          <template #tip>
            <div class="el-upload__tip">
              Can only upload JPEG, PNG, or GIF picture
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="\">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="editUserInfo">Save Change</el-button>
        <el-button type="primary"  @click="removeImg">Delete Image</el-button>
        <el-button @click="returnPage">Return</el-button>
      </el-form-item>
    </el-form>
    <br>
  </div>
</template>

<script>
import {h} from "vue";
export default {
  name: "ChangeProfile.vue",
  data() {
    return {
      activeIndex: '1',
      firstName: "",
      lastName: "",
      email: "",
      userId:sessionStorage.getItem("userId"),
      token:sessionStorage.getItem("token"),
      userInfo: [],
      password: "",
      currentPassword: "",
      pwdFlag1: false,
      pwdFlag2: false,
      url: 'http://localhost:4941/api/v1/users/'+sessionStorage.getItem("userId")+'/image',
      icon1: 'el-icon-view',
      icon2: 'el-icon-minus',
      error: "",
      errorFlag: false,
      uploadDisabled:false,
      dialogImageUrl: 'https://free-images.com/or/7497/cherry_tree_blossom_2007.jpg',
      dialogVisible: false,
    }
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    changePassword: function(e) {
      this.pwdFlag = !this.pwdFlag;
      e.preventDefault();
    },
    getUserInfo() {
      this.axios.get('http://localhost:4941/api/v1/users/'+this.userId, {params:{"id": this.userId},
        headers: {"X-Authorization": sessionStorage.getItem("token")}})
          .then((response) => {
            this.userInfo = response.data;
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    getUserImage() {
      this.axios.defaults.headers = {
        'content-type': 'application/x-www-form-urlencoded'
      }
      this.axios.get('http://localhost:4941/api/v1/users/'+this.userId+'/image', {params:{"id": this.userId}})
          .then(() => {
            this.url = 'http://localhost:4941/api/v1/users/'+this.userId+'/image';
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;

          });
    },
    returnPage() {
      this.$router.push("/users/my");
    },
    editUserInfo() {
      if (this.firstName === "") {
        this.firstName = this.userInfo.firstName;
      }
      if (this.lastName === "") {
        this.lastName = this.userInfo.firstName;
      }
      if (this.email === "") {
        this.email = this.userInfo.email;
      }
      if (this.password === "" && this.currentPassword === "") {
        this.password = this.userInfo.currentPassword;
        this.currentPassword = this.userInfo.currentPassword;
      }

      this.axios.patch('http://localhost:4941/api/v1/users/'+this.userId, {"firstName": this.firstName,
            "lastName": this.lastName, "email": this.email, "password": this.password, "currentPassword": this.currentPassword},
          {params:{"id": this.userId},
        headers: {"X-Authorization": sessionStorage.getItem("token")}})
          .then(() => {
             this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    putImage(file, fileList) {
      this.url = file.raw;
      if(fileList.length >= 1){
        this.uploadDisabled = true;
      }
      this.axios.put("http://localhost:4941/api/v1/users/"+this.userId+"/image", this.url,
          { headers: {"X-Authorization": sessionStorage.getItem("token"), "Content-Type": this.url.type}})
          .then(() => {
            // this.$router.push("/users/my");
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    removeImg() {
      this.axios.delete("http://localhost:4941/api/v1/users/"+this.userId+"/image",
          { params: {"id":this.userId} , headers: {"X-Authorization": sessionStorage.getItem("token")}})
          .then(() => {
            this.$message({
              type: 'success',
              message: h('i', {style: 'color: teal'}, 'Delete seccessfully!')
            });
          }, (error) => {
            this.error = error.response.statusText;
            this.errorFlag = true;
          });
    },
    handleSelect(key) {
      if (key === "1") {
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      }else if(key === "2-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/register"});
      } else if(key === "2-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/login"});
      } else if(key === "2-3") {
        this.activeIndex = "1";
        this.$router.push({path:"/users/my"});
      } else if(key === "2-4") {
        sessionStorage.clear();
        this.activeIndex = "1";
        this.$router.push({path:"/"});
      } else if(key === "3-1") {
        this.activeIndex = "1";
        this.$router.push({path:"/events"});
      } else if(key === "3-2") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/create"});
      } else if(key === "4") {
        this.activeIndex = "1";
        this.$router.push({path:"/events/my"});
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png' || 'image/gif';
      if (!isJPG) {
        this.$message.error("Can only upload JPEG, PNG, or GIF picture!");
      }
      return isJPG;
    },
    open() {
      this.$alert(this.error, 'Register Fail', {
        confirmButtonText: 'OK',
      });
    },
    handleChange(file,fileList){
      if(fileList.length >= 1){
        this.uploadDisabled = true;
      }
    },
    handleRemove() {
      this.uploadDisabled = false
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      if(!this.dialogImageUrl) {
        this.dialogImageUrl = 'https://free-images.com/or/7497/cherry_tree_blossom_2007.jpg';
      }
      this.dialogVisible = true;
    }
  }
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-menu-demo {
  margin-top: -60px;
}
.edit {
  margin-top: 30px;
  display: inline-block;
}
.hide /deep/ .el-upload--picture-card {
  display: none;
}
</style>