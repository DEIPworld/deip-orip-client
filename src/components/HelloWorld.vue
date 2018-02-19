<template>
    <div class="hello">
        <img src="../assets/logo.png">
        <h1>{{ msg }}</h1>

        <h2>Custom Pages</h2>
        <ul>
            <li>
                <a class="red-bg" href="/#/adminpage">Admin Page</a>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "HelloWorld",
        data() {
            return {
                msg: "Welcome to Vue.js App"
            };
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    @import '../styles/common.less';

    .hello {
        text-align: center;
    }
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        display: inline-block;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>
