function setup() {
    createCanvas(windowWidth, windowHeight);
    r_textBox = createInput('');
    r_textBox.position(width - width / 3, height / 10)
    r_textBox.size(50)
    r_slider = createSlider(0, 255, 100, 1);
    r_slider.position(width - width / 3, height / 5);
    r_slider.input(r_sliderChange);
    r_button = createButton('submit');
    r_button.position(r_textBox.x + r_textBox.width + 10, r_textBox.y);
    r_button.mousePressed(updateValue);
    r_textBox.value(r_slider.value());

    g_textBox = createInput('');
    g_textBox.position(width - width / 3, 3 * height / 10)
    g_textBox.size(50)
    g_slider = createSlider(0, 255, 100, 1);
    g_slider.position(width - width / 3, 2 * height / 5);
    g_slider.input(g_sliderChange);
    g_button = createButton('submit');
    g_button.position(g_textBox.x + g_textBox.width + 10, g_textBox.y);
    g_button.mousePressed(updateValue);
    g_textBox.value(g_slider.value());

    b_textBox = createInput('');
    b_textBox.position(width - width / 3, 5 * height / 10)
    b_textBox.size(50)
    b_slider = createSlider(0, 255, 100, 1);
    b_slider.position(width - width / 3, 3 * height / 5);
    b_slider.input(b_sliderChange);
    b_button = createButton('submit');
    b_button.position(b_textBox.x + b_textBox.width + 10, b_textBox.y);
    b_button.mousePressed(updateValue);
    b_textBox.value(b_slider.value());
}

function draw() {
    background(255);
    let r = r_slider.value();
    let g = g_slider.value();
    let b = b_slider.value();

    noStroke();
    fill(r, g, b);
    rect(width / 20, height / 20, windowWidth - windowWidth / 2, windowHeight - windowHeight / 4);
    textStyle(BOLD);
    textSize(24);
    fill(255, 0, 0);
    text("R", width - width / 2.5, height / 10);
    fill(0, 255, 0);
    text("G", width - width / 2.5, 2 * height / 10);
    fill(0, 0, 255);
    text("B", width - width / 2.5, 3 * height / 10);
}

function updateValue() {
    r_slider.value(r_textBox.value())
    g_slider.value(g_textBox.value())
    b_slider.value(b_textBox.value())
}

function r_sliderChange() {
    r_textBox.value(r_slider.value());
}

function g_sliderChange() {
    g_textBox.value(g_slider.value());
}

function b_sliderChange() {
    b_textBox.value(b_slider.value());
}