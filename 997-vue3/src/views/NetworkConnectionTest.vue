<!-- 网络状态的监控 -->
<template>
    <div>
        <h1>NetworkConnectionTest</h1>
        <div class="content">
            <div>
                <span>在线状态：</span>
                <span>{{ networkState.online }}</span>
            </div>
            <div>
                <span>网络速率：</span>
                <span>{{ networkState.speed }} Mpb</span>
            </div>
            <div>
                <span>网络速率：</span>
                <span>{{ networkState.rtt }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive } from 'vue';
    
    document.title = '网络状态测试';

    const netState = navigator.connection;
    let networkState = reactive({
        online: navigator.onLine,   // 在线状态
        speed: netState.downlink,   // 贷款（下载速度）
        rtt: netState.rtt           // 往返时间（延迟）
    });
    
    // watch(
    //     () => navigator,         // 不是响应式的，监听不到
    //     (cur, pre) => {
    //         console.log('network state changed', cur, pre);
    //     },
    //     { deep: true }
    // );

    window.addEventListener('online', () => {
        networkState.online = true;
    })
    window.addEventListener('offline', () => {
        networkState.online = false;
    });

    navigator.connection.addEventListener('change', () => {
        networkState.speed = netState.downlink;
        networkState.rtt = netState.rtt;
    });
</script>