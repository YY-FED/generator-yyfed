let test = async function () {
    return await setTimeout(function () {
        console.log('is sync function, right?');
    }, 5000);
}

let foo = test();
