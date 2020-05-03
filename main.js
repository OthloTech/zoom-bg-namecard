const preview = document.getElementById("preview");
const previewContext = preview.getContext("2d");
const outputArea = document.getElementById("output");
const textarea = document.getElementById("textarea");
const inputImage = document.getElementById("input-image");
const generateButton = document.getElementById("generate-button");
const mirrorCheckbox = document.getElementById("mirror-checkbox");
const rightCheckbox = document.getElementById("right-checkbox");
const fontsizeSelect = document.getElementById("fontsize-select");
const topColor = document.getElementById("top-color");
const backgroundColor = document.getElementById("bg-color");
const textColor = document.getElementById("txt-color");
const frameColor = document.getElementById("frame-color");
const image = new Image();

drawPreview();

// ====================

function drawPreview() {
    const splitText = textarea.value.split("\n");
    const fontsize = Math.floor(fontsizeSelect.value);
    previewContext.font = `${fontsize}px ${CANVAS_FONT}`;
    const maxTextWidth = Math.floor(Math.max(...splitText.map(r => previewContext.measureText(r).width)));
    const textLineSpace = Math.floor(fontsize * 0.2);
    const leftOffset = rightCheckbox.checked ?
        CANVAS_WIDTH - TAG_AREA_WIDTH - TAG_AREA_POSITION_X * 2 - Math.max(0, maxTextWidth - TAG_AREA_WIDTH + TAG_AREA_POSITION_X):
        0;

    // 全体クリア
    previewContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ベース背景描画
    previewContext.fillStyle = topColor.value;
    previewContext.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 画像描画
    if (image.src) {
        previewContext.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }


    // 名札背景描画
    previewContext.fillStyle = backgroundColor.value;
    previewContext.fillRect(
        TAG_AREA_POSITION_X + leftOffset,
        TAG_AREA_POSITION_Y,
        maxTextWidth > TAG_AREA_WIDTH - (TAG_AREA_INNER_PADDING * 2) ? maxTextWidth + (TAG_AREA_INNER_PADDING * 2) : TAG_AREA_WIDTH,
        TAG_AREA_POSITION_Y +
        TAG_AREA_INNER_PADDING +
        (splitText.length - 1) * textLineSpace +
        splitText.length * fontsize
    );
    /*
          // 名札枠描画
          previewContext.strokeStyle = frameColor.value;
          previewContext.strokeRect(
            TAG_AREA_POSITION_X + leftOffset,
            TAG_AREA_POSITION_Y,
            TAG_AREA_WIDTH,
            TAG_AREA_POSITION_Y +
              TAG_AREA_INNER_PADDING +
              (splitText.length - 1) * textLineSpace +
              splitText.length * fontsize
          );
        */

    // テキスト描画
    previewContext.fillStyle = textColor.value;
    previewContext.font = `${fontsize}px ${CANVAS_FONT}`;
    for (let i in splitText) {
        previewContext.fillText(
            splitText[i],
            TAG_AREA_POSITION_X + TAG_AREA_INNER_PADDING + leftOffset,
            TAG_AREA_POSITION_Y +
            TAG_AREA_INNER_PADDING +
            fontsize +
            i * (fontsize + textLineSpace)
        );
    }
}

// ======== イベント =======

textarea.addEventListener("input", () => {
    drawPreview();
});

inputImage.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const r = new FileReader();
    r.onload = () => {
        image.src = r.result;
        image.onload = () => {
            drawPreview();
        };
    };
    r.readAsDataURL(file);
});

fontsizeSelect.addEventListener("change", () => {
    drawPreview();
});

topColor.addEventListener("change", () => {
    drawPreview();
});

backgroundColor.addEventListener("change", () => {
    drawPreview();
});

textColor.addEventListener("change", () => {
    drawPreview();
});

/*
frameColor.addEventListener("change", () => {
    drawPreview();
});
*/

generateButton.addEventListener("click", () => {
    const imgData = preview.toDataURL();
    outputArea.innerHTML = `
    <a href="${imgData}" download="file.png">🙋‍♀️ ダウンロードする</a>
  `;
});

// ======= 高度設定イベント =======

mirrorCheckbox.addEventListener("click", () => {
    previewContext.scale(-1, 1);
    previewContext.translate(-CANVAS_WIDTH, 0);
    drawPreview();
});

rightCheckbox.addEventListener("click", () => {
    drawPreview();
});
