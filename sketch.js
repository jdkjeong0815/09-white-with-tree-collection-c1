// Created: 2025-Feb-02 by DK Jeong
// File Name: 베지어커브-스터디-화이트-나무-s2-final
// Title: 화이트 with 나무 시리즈 컬렉션 1 
// p5.js
// 작품 설명 - 사진작가의 작품을 오마주1  생성형 디지털 작품으로 만들기
// 눈 덮인 하얀 설원을 배경으로 홀로 눈을 맞고 서 있는 나무를 흰색 나무로 표현
// 나무색을 흰색으로 한 것은 신비감을 주기 위함
// 하늘과 땅을 구분하는 경계선은 있는 듯 없는 듯한 느낌으로 구현
// 그라디언트 색상 대비를 통해 경계선이 드러나게 함
// 캔버스는 화면비에 상관없이 정방형으로 하고 나무와 달의 위치는 고정하여 같은 느낌을 받도록 구현
// 프로그램이 주기적으로 갱신될때 마다 약간의 밝기 차이를 랜덤으로 보여 주어 다양한 느낌을 받도록 함

// === 기술적 내용
// 베지어 커브 사용
// 베지어 커브 기준으로 top, bottom으로 면을 구분
// 투명도를 사용
// 그라디언트 사용(top면은 수직, bottom면은 대각선)
// 나무와 달의 크기도 화면에 비례하여 연동 시킴
// 눈이 내리는 모션 

// === 향후 업데이트 방향
// 1) 검은 색상의 나무에 흰 눈이 바람에 날려 쌓여 있는 모습을 연출
// 2) 컬러 모드를 HSL 모드로 변경 적용 
//================================================

let saveFileName = "white with tree collection-c1"; // 저장 파일명
let img;
let scaleFactor = 1; // 나무 이미지를 줄일 비율
let snowflakes = []; // 눈송이 배열
let dep; // 테두리 두께 30px
let innerDep; // 안쪽 프레임 두께 설정  80px
let aspectRatio; // 화면비 계산

let mainLayer, snowLayer;
// let randomElements = {};
let minCanvasSize;
let minCanvas;
let canvas;

let newWidth; 
let newHeight;
let topColor1, topColor2;
let bottomColor1, bottomColor2;

// function touchStarted() {
//   // 첫 번째 터치: 풀스크린 활성화
//   let fs = fullscreen();
//   fullscreen(!fs);
  
//   setTimeout(refreshSketch, 2000);  // 애니메이션 효과를 위해 120초로 변경
//   // return false; // 기본 터치 동작 방지
// }
//================================================

function preload() {
  // 나무 이미지를 로드합니다.
  img = loadImage("assets/dead-tree-silhouette-36-w.png");
}
//================================================

function setup() {
  frameRate(60); // 프레임 레이트 설정
  minCanvas = min(windowWidth, windowHeight);
  canvas = createCanvas(minCanvas, minCanvas);
  // 캔버스의 좌측 상단 기준 위치를 계산하여 화면 중앙에 배치합니다.
  canvas.position((windowWidth - minCanvas) / 2, (windowHeight - minCanvas) / 2);

  // 레이어 생성
  mainLayer = createGraphics(minCanvas, minCanvas);
  snowLayer = createGraphics(minCanvas, minCanvas); // 별도의 레이어 생성
  minCanvasSize = min(minCanvas, minCanvas);

  // dep = (minCanvasSize/60); // 정방형 LED 캔버스 : 프레임을 좁게 설정
  // innerDep = dep * 5; // 안쪽 프레임 크기를 바깥쪽 프레임의 x배로 설정
  dep = 0; // 정방형 LED 캔버스 : 바깥 프레임을 제거
  innerDep = minCanvasSize/20; // 안쪽 프레임 크기를 적절히 설정

  // 랜덤 요소 초기화
  clear();
  initializeRandomElements();

  drawGradientBackground();
  drawGradientMoon();
  drawFrame();
  
  // 240초마다 자동 갱신
  setInterval(refreshSketch, 120000);  // 240000
}
//================================================

function draw() {

  // 눈송이를 그리는 레이어
  snowLayer.clear(); // 이전 프레임 지우기
  drawSnowflakes();
  image(mainLayer, 0, 0); // 메인 레이어를 메인 캔버스 위에 덮어씀
  image(snowLayer, 0, 0); // 눈 레이어를 메인 캔버스 위에 덮어씀
}
//================================================

function initializeRandomElements() {
  // canvas = createCanvas(minCanvas, minCanvas);

  // 레이어 생성
  mainLayer = createGraphics(minCanvas, minCanvas);
  snowLayer = createGraphics(minCanvas, minCanvas); // 별도의 레이어 생성
  snowflakes = [];
  // dep = (minCanvasSize/60); // 정방형 LED 캔버스 : 프레임을 좁게 설정
  // innerDep = dep * 5; // 안쪽 프레임 크기를 바깥쪽 프레임의 x배로 설정
  dep = 0; // 정방형 LED 캔버스 : 바깥 프레임을 제거
  innerDep = minCanvasSize/20; // 안쪽 프레임 크기를 적절히 설정
}
//================================================

function drawGradientBackground() {

  let scheme = floor(random(4)); // 0, 1, 2, 3 중 하나 선택
  console.log("scheme: ", scheme);
// top 면
  if (scheme === 0) {
    // 회색 계열
    topColor1 = color(random(250, 255)); // 예: 아주 밝은 회색
    topColor2 = color(random(200, 220)); // 약간 어두운 회색
  } else if (scheme === 1) {
    // 노랑, 주황 계열
    topColor1 = color(250, random(255), 0);  // 노란색에서 노란-주황 계열
    topColor2 = color(200, random(200), 0);
  } else if (scheme === 2) {
    // 청, 남색 계열
    topColor1 = color(0, random(255), 255);  // 파란색에서 남색 계열
    topColor2 = color(0, random(200), 200);
  }  else if (scheme === 3) {
    // 청, 남색 계열 - 단색
    topColor1 = color(0, random(0, 255), 255);  // 파란색에서 남색 계열
    topColor2 = topColor1;
  }
 
  // bottom 면  
  bottomColor1 = color(random(255, 255)); // Start gradient for bottom
  bottomColor2 = color(random(100, 170)); // End gradient for bottom


  let controlX1 = width / 1.6;
  let controlY1 = height / 1.8;
  let controlX2 = width / 1.6;
  let controlY2 = height / 1.7;
  let endX = width;
  let endY = height / 1.5;
  let ctx = drawingContext;
  
  // Get CanvasRenderingContext2D
  ctx = mainLayer.drawingContext;
  
  // 1) Create top region gradient - 그라디언트 방향은 x1, y1과 x2, y2의 사각형에서 두 점의 방향대로 그라디언트 생성
  let topGradient = ctx.createLinearGradient(0, 0, 0, height / 2);  // 수직 방향
  // 알파값을 넣으면 화면에 잔상이 생김(다른 알파값을 사용하는 객체에 영향이 미침). 따라서 사용하지 않음
  // 따라서 saturation이 낮게 색채값을 조절하려면 HSL 모드로 변경 필요
  // topGradient.addColorStop(0, `rgba(${red(topColor1)}, ${green(topColor1)}, ${blue(topColor1)}, ${alpha(topColor1)/255})`);
  // topGradient.addColorStop(1, `rgba(${red(topColor2)}, ${green(topColor2)}, ${blue(topColor2)}, ${alpha(topColor1)/255})`);
  topGradient.addColorStop(0, `rgb(${red(topColor1)}, ${green(topColor1)}, ${blue(topColor1)}`);
  topGradient.addColorStop(1, `rgb(${red(topColor2)}, ${green(topColor2)}, ${blue(topColor2)}`);
  
  ctx.fillStyle = topGradient;
  ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height/2);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.lineTo(width, 0);
  ctx.closePath();
  ctx.fill();

  // 2) 나무 그리기
  // 이미지 축소
  newHeight = (height - 2 * (dep + innerDep)) * 2 / 5;
  newWidth = img.width * (newHeight / img.height);
  // 이미지를 메인 레이어에 그립니다.
  mainLayer.image(img, width*(6/10), height*(2.8/10), newWidth, newHeight);
  // mainLayer.image(img, randomX, height - newHeight - dep - innerDep + 20);

  // 3) Create bottom region gradient
  let bottomGradient = ctx.createLinearGradient(0, height/2, 0, height);  // 수직 방향
  bottomGradient.addColorStop(0, `rgb(${red(bottomColor1)}, ${green(bottomColor1)}, ${blue(bottomColor1)})`);
  bottomGradient.addColorStop(1, `rgb(${red(bottomColor2)}, ${green(bottomColor2)}, ${blue(bottomColor2)})`);
  
  ctx.fillStyle = bottomGradient;
  ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 4) Draw center Bezier curve stroke
  stroke(220, 250);
  strokeWeight(0.8);
  noFill();
  beginShape();
    vertex(0, height / 2);
    bezierVertex(controlX1, controlY1, controlX2, controlY2, endX, endY);
  endShape();

}
//================================================

function drawGradientMoon() {  
  let moonX = width * (2 / 10);
  let moonY = height * (1.5 / 10);
  let moonSize = height * (1 / 40);
  
  // 그라디언트 달 그리기
  for (let r = moonSize; r > 0; --r) {
    let inter = map(r, 0, moonSize, 0, 1);
    let c = lerpColor(color(250), color(225), inter);
    // let c = lerpColor(color(205, 205, 205), color(255, 255, 255), inter); 
    mainLayer.fill(c);
    mainLayer.noStroke();
    mainLayer.ellipse(moonX, moonY, r * 2, r * 2);
  }

  // 안개 효과 추가
  mainLayer.drawingContext.filter = 'blur(15px)';
  let fogSize = floor(random(10, 20));
  for (let i = 0; i < fogSize; i++) {
    let fogColor = color(255, 255, 255, 20);
    mainLayer.fill(fogColor);
    let ellipseWidth = moonSize * 2.5 * random(0.8, 1.2);
    let ellipseHeight = moonSize * 2.5 * random(0.8, 1.2);
    mainLayer.ellipse(moonX + random(-20, 20), moonY + random(-20, 20), ellipseWidth, ellipseHeight);
  }
  mainLayer.drawingContext.filter = 'none';
}
//================================================

function drawFrame() {
  
  // 액자 프레임 색상 설정 (검은색)
  mainLayer.noStroke();

  // 1) 바깥쪽 프레임 금속 재질 그라디언트
  for (let i = 0; i < dep; i++) {
    let inter = map(i, 0, dep, 10, 100); // (10, 100) (50, 150) (230, 240) /  어두운 회색에서 밝은 회색으로 그라디언트
    mainLayer.fill(inter);

    // 위쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, i);
    mainLayer.vertex(width - i, i);
    mainLayer.vertex(width - dep, dep);
    mainLayer.vertex(dep, dep);
    mainLayer.endShape(CLOSE);

    // 아래쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, height - i);
    mainLayer.vertex(dep, height - dep);
    mainLayer.vertex(width - dep, height - dep);
    mainLayer.vertex(width - i, height - i);
    mainLayer.endShape(CLOSE);

    // 왼쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, i);
    mainLayer.vertex(dep, dep);
    mainLayer.vertex(dep, height - i);
    mainLayer.vertex(i, height - i);
    mainLayer.endShape(CLOSE);

    // 오른쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(width - i, i);
    mainLayer.vertex(width - dep, dep);
    mainLayer.vertex(width - dep, height - dep);
    mainLayer.vertex(width - i, height - i);
    mainLayer.endShape(CLOSE);
  }

  // 2) 안쪽 프레임 그라디언트 - 바탕 색상 정하기
  for (let i = 0; i < innerDep; i++) {
    let inter = map(i, 0, innerDep, 255, 255); // 흰색으로 통일 (255, 255) (5, 5)
    mainLayer.fill(inter);

    // 위쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, dep + i);
    mainLayer.vertex(width - dep - i, dep + i);
    mainLayer.vertex(width - dep - innerDep, dep + innerDep);
    mainLayer.vertex(dep + innerDep, dep + innerDep);
    mainLayer.endShape(CLOSE);

    // 아래쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, height - dep - i);
    mainLayer.vertex(width - dep - i, height - dep - i);
    mainLayer.vertex(width - dep - innerDep, height - dep - innerDep);
    mainLayer.vertex(dep + innerDep, height - dep - innerDep);
    mainLayer.endShape(CLOSE);

    // 왼쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, dep + i);
    mainLayer.vertex(dep + innerDep, dep + innerDep);
    mainLayer.vertex(dep + innerDep, height - dep - i);
    mainLayer.vertex(dep + i, height - dep - i);
    mainLayer.endShape(CLOSE);

    // 오른쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(width - dep - i, dep + i);
    mainLayer.vertex(width - dep - innerDep, dep + innerDep);
    mainLayer.vertex(width - dep - innerDep, height - dep - i);
    mainLayer.vertex(width - dep - i, height - dep - i);
    mainLayer.endShape(CLOSE);
  }

}
//================================================

function drawSnowflakes() {
  // 새로운 눈송이 추가
  if (random(1) < 0.04) { // 확률을 0.1에서 0.04로 줄여 눈송이 생성 빈도를 낮춤
    snowflakes.push(new Snowflake());
  }
  //console.log("snowflake: ", snowflakes.length);

  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let flake = snowflakes[i];
    flake.update();
    flake.display(snowLayer);
    if (flake.posY > height - dep || flake.posX < dep || flake.posX > width - dep) {
      snowflakes.splice(i, 1); // 화면 밖으로 나간 눈송이 삭제
    }
  }
}
//================================================

class Snowflake {
  constructor() {
    this.posX = random(dep + innerDep, width - dep - innerDep);
    this.posY = dep + innerDep; // 위에서 시작
    this.size = random(2, 5);
    this.speed = random(0.1, 0.3); // 눈송이가 떨어지는 속도 0.3 ~ 0.5
    this.alpha = random(100, 255); // 투명도 설정
    this.wind = random(-0.07, 0.08); // 바람 효과
  }

  update() {
    this.posY += this.speed;
    this.posX += this.wind;
  }

  display(layer) {
    layer.fill(255, this.alpha);
    layer.noStroke();
    if (this.posY <= height - dep - innerDep && this.posX > dep + innerDep && this.posX <= width - 2 * dep - 2 * innerDep) {
      layer.ellipse(this.posX, this.posY, this.size);
    }
  }
}
//================================================

function refreshSketch() {
  clear();
  // 랜덤 요소 초기화
  initializeRandomElements();
  drawGradientBackground();
  drawGradientMoon();
  drawFrame();
}
//================================================

function clearSnowflakes() {
  // 눈송이 배열 초기화
  snowflakes = [];
}
