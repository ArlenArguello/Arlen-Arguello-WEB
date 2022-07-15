const board = document.querySelector(".board");
const frameFilters = document.querySelectorAll("svg def .fFrame");
const frameColors = [
	["rgb(102,68,51)", "rgb(10,1,1)"],
	["rgb(100,50,50)", "rgb(120,120,80)"],
	["rgb(193, 154, 108)", "rgb(118, 74, 52)"],
	["rgb(200,200,200)", "rgb(10,10,10)"]
];
const memos = document.querySelectorAll(".content>ul>li");
const memoColors = ["#13f4ef", "#68ff00", "#faff00", "#ffbf00", "#ff005c"];

init();

function init() {
	// Memo
	board.style.setProperty(
		"--fw",
		`${Math.round(randomBetween(0.5, 2) * 10) / 10}rem`
	);
	memos.forEach((memo) => {
		const rotation = randomBetween(-5, 5);
		const transformOrigin = rotation < 0 ? "top left" : "top right";
		const color = memoColors[Math.floor(Math.random() * memoColors.length)];
		memo.classList.remove("drop");
		memo.style.setProperty("--rd", `${rotation}deg`);
		memo.style.setProperty("--to", transformOrigin);
		memo.style.setProperty("--bc", `${color}`);
		memo.addEventListener("click", dropMemo);
	});
	// Frame Filter

	//colorMatrix
	const frameColor = frameColors[Math.floor(Math.random() * frameColors.length)];

	const clr1 = linearRGB(frameColor[0]);
	const clr2 = linearRGB(frameColor[1]);
	const diff = clr2.map((v, i) => v - clr1[i]);

	frameFilters.forEach((frameFilter) => {
		const freq1 = randomBetween(0.2, 0.6);
		const freq2 = randomBetween(0.01, 0.04);
		const turbulenceEl = frameFilter.querySelector("feTurbulence");
		if (frameFilter.id == "fVer") {
			turbulenceEl.setAttribute("baseFrequency", `${freq1} ${freq2}`);
		} else {
			turbulenceEl.setAttribute("baseFrequency", `${freq2} ${freq1}`);
		}
		const colormatrixEl = frameFilter.querySelector("feColorMatrix");
		colormatrixEl.setAttribute(
			"values",
			`
			0 0 0 ${diff[0]} ${clr1[0]}
			0 0 0 ${diff[1]} ${clr1[1]}
			0 0 0 ${diff[2]} ${clr1[2]}
			0 0 0 0 1`
		);
	});

	//bg
	const bgFilter = document.querySelector("#fWall");
	const bgTurbulence = bgFilter.querySelector("feTurbulence");
	const bgDiffuseLighting = bgFilter.querySelector("feDiffuseLighting");
	const bgDistantLight = bgFilter.querySelector("feDistantLight");
	bgTurbulence.setAttribute("baseFrequency", randomBetween(0.4, 0.9));
	bgTurbulence.setAttribute("numOctaves", Math.round(randomBetween(1, 6)));
	bgDiffuseLighting.setAttribute("lighting-color", frameColor[0]);
	bgDistantLight.setAttribute("elevation", Math.round(randomBetween(20, 50)));
	document.body.style.setProperty("--bodyBg", frameColor[0]);
}
// util functions
function linearRGB(rgbString) {
	return rgbString
		.match(/\d+/g)
		.map((v) => Math.round((Number(v) / 255) * 100) / 100);
}
function randomBetween(min, max) {
	return Math.random() * (max - min) + min;
}

function dropMemo(e) {
	const memo = e.currentTarget.classList.add("drop");
	console.log(memo);
}
