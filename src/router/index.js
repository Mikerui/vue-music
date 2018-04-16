import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Cookies from 'js-cookie'
import VueRouter from 'vue-router'
import iView from 'iview'
// 登陆拦截
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    });
  } else if (Cookies.get('user') && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    Util.title();
    next({
      name: 'home_index'
    });
  } else {
    const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter], to.name);
    if (curRouterObj && curRouterObj.access !== undefined) { // 需要判断权限的路由
      if (curRouterObj.access === parseInt(Cookies.get('access'))) {
        Util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
      } else {
        next({
          replace: true,
          name: 'error-403'
        });
      }
    } else { // 没有配置权限的路由, 直接通过没有配置权限的路由, 直接通过
      Util.toDefaultPage([...routers], to.name, router, next);
    }
  }
});

router.afterEach((to) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});



Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
