// 是否需要进行依赖收集
let shouldTrack = true;

// 暂停依赖收集
export const pauseTracking = () => {
    shouldTrack = false;
};

// 恢复依赖收集
export const resumeTracking = () => {
    shouldTrack = true;
};

// 依赖收集
export const track = (target, key, type) => {
    if(!shouldTrack) {
        return;
    }
    console.log(`%c依赖收集 【${type}】 ${key}`, 'color: #f00');
};

// 派发更新
export const trigger = (target, key, type) => {
    console.log(`%c派发更新 【${type}】 ${key}`, 'color: #00f');
}