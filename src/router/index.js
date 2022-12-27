import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '../views/PostView.vue'
import SigninView from '../views/SigninView.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView
	},
	{
		path: '/post',
		name: 'post',
		component: PostView
	},
	{
		path: '/signin',
		name: 'signin',
		component: SigninView,
		props: true
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
