let menuItems = document.getElementsByClassName("menu-item-hasChild");
let items = document.getElementsByClassName("menu-first-items");
let noChildItem = document.getElementsByClassName('menu-no-child');
let icons = document.getElementsByClassName("icon");

/** 记录当前打开的一级菜单是哪个 没有打开任何菜单的状态 默认为-1 */
let currentDisplayIndex = -1;

for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].onclick = function () {
        /** 再次点击已打开的菜单，关闭此菜单 */
        if (currentDisplayIndex === i) {
            items[currentDisplayIndex].classList.toggle("ul-active");
            icons[currentDisplayIndex].classList.toggle("reverse-icon");
            menuItems[currentDisplayIndex].classList.toggle('bg-color');
            currentDisplayIndex = -1
            return;
        }

        /** 关闭前一个被打开的菜单 打开当前要打开的菜单 */
        if (currentDisplayIndex != -1) {
            items[currentDisplayIndex].classList.toggle("ul-active");
            icons[currentDisplayIndex].classList.toggle("reverse-icon");
            menuItems[currentDisplayIndex].classList.toggle('bg-color');

            items[i].classList.toggle("ul-active");
            icons[i].classList.toggle("reverse-icon");
            menuItems[i].classList.toggle('bg-color');
        }
        /** 没有任何菜单被打开时 打开新菜单 */
        else{
            items[i].classList.toggle("ul-active");
            icons[i].classList.toggle("reverse-icon");
            menuItems[i].classList.toggle('bg-color');
        }

        // 清除没有下一级列表的菜单的背景
        if(currentDisplayIndex === -1){
            for(let e of noChildItem){
                if(e.classList.contains('bg-color')){
                    e.classList.toggle('bg-color');
                }
            }
        }
        
        currentDisplayIndex = i;   
    };
}

// 当没有子菜单的菜单被点击
for(let e of noChildItem){
    e.addEventListener('click',()=>{
        // 处理非同类菜单
        for(let i = 0 ; i < items.length ; i ++){
            if(items[i].classList.contains('ul-active')){
                items[i].classList.toggle('ul-active');
                icons[i].classList.toggle('reverse-icon');
                menuItems[i].classList.toggle('bg-color');
            }
        }
        // 去除其他同类子菜单的背景色
        for(let i = 0 ; i < noChildItem.length ; i ++){
            if(noChildItem[i].classList.contains('bg-color')){
                noChildItem[i].classList.toggle('bg-color');
            }
        }
        // 为自己添加背景色
        e.classList.toggle('bg-color');
        currentDisplayIndex = -1;
    })
}

// 导航栏的显现与隐藏
let OC = document.getElementsByClassName("open-close")[0];
let menu = document.getElementsByClassName("left-menu")[0];
OC.onclick = function () {
    OC.classList.toggle("reverse-condition");
    menu.classList.toggle("hide-menu");
};