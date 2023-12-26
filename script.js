function createSnowflake() {
    const snowflakeChars = ['❅', '❆', '❄', '✻', '✼', '❉', '❇', '✥']; // Array of snowflake characters
    const snowflakeChar = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)]; // Randomly pick one

    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.textContent = snowflakeChar; // Use the randomly picked character
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's'; // random duration
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = Math.random() * 20 + 10 + 'px';
    document.body.appendChild(snowflake);

    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

setInterval(createSnowflake, 100);

function createLight() {
    const light = document.createElement('div');
    light.classList.add('light');
    light.style.left = Math.random() * 100 + 'vw';
    light.style.top = Math.random() * 100 + 'vh';
    document.body.appendChild(light);

    setTimeout(() => {
        light.remove();
    }, 5000);
}

setInterval(createLight, 150);