<template>
	<div class="signin">
		<h2 class="sub-title">Sign In</h2>
		<div class="result" v-if="logoutText != undefined || errMsg">
			<span v-if="errMsg">{{ errMsg }}</span>
			<span v-else>{{ logoutText }}</span>
		</div>
		<div class="form">
			<dl>
				<dt><label for="email"><span class="material-symbols-outlined">mail</span></label></dt>
				<dd><input type="email" v-model="mailaddress" name="email" id="email" /></dd>
			</dl>
			<dl>
				<dt><label for="key"><span class="material-symbols-outlined">key</span></label></dt>
				<dd><input type="password" v-model="password" name="key" id="key" /></dd>
			</dl>
			<button @click="login">ログイン</button>
		</div>
	</div>
</template>

<script>
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"

export default {
	name: 'SigninView',
	props: {logoutText: String},
	data: function () {
		return {
			db: null,
			isVisible: false,
			mailaddress: '',
			password: '',
			errMsg: ''
		}
	},
	mounted(){
		let self = this;
		firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
				self.$router.push('/post').catch(()=>{})
			}
		})
	},
	methods: {
		login () {
			firebase.auth().signInWithEmailAndPassword(this.mailaddress, this.password)
			.then(() => {
				this.errMsg = "";
			})
			.catch(() => {
				this.errMsg = "ログインに失敗しました"
			})
		},
		logout: function () {
			firebase.auth().signOut()
			this.isVisible = false
		}
	}
}
</script>

<style lang="scss">
	
</style>