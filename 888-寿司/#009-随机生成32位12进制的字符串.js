(() => {
    const {random: rand, ceil} = Math;
    const str = new Array(32).fill(0).map(() => {
        const base = ceil(rand() * 16);
        return base.toString(16);
    })
    console.log(str.join(''));
})();

