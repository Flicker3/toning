/**
 * 调色hooks
 */

import { ref } from "vue";
import { fabric } from "fabric";
export const useToning = () => {

	const brightnessData = ref(
		{
			name: "图片",
			key: "Img",
			/**
			 * 初始图片的数据
			 */
			originalImg: "",
			/**属性 */
			attr: [
				{
					name: "明度",
					key: "brightness",
					value: 0
				},
				{
					name: "亮度",
					key: "lightness",
					value: 0
				},
				{
					name: "对比度",
					key: "contrast",
					value: 0
				},
				{
					name: "色相",
					key: "hue",
					value: 0
				},
				{
					name: "饱和度",
					key: "saturation",
					value: 0
				},
				{
					name: "色调",
					key: "tone",
					value: 0
				},
				{
					name: "模糊度",
					key: "blur",
					value: 0
				},
				{
					name: "透明度",
					key: "opacity",
					value: 100
				}
			]
		}
	);
	/**
	 * 图片调色
	 */
	const changeImgBrightness = (attr: any, callback: (processedImg: string) => void) => {
		// 获取原始图片路径
		let imgSrc =brightnessData.value.originalImg
		// 创建 fabric.Image 实例
		fabric.Image.fromURL(
			imgSrc,
			(img:any) => {
				// 初始化滤镜数组
				const filters: any[] = [];

				// 遍历属性，应用相应的滤镜
				attr.forEach((item: any) => {
					switch (item.key) {
						case "brightness":
							filters.push(
								new fabric.Image.filters.Brightness({
									brightness: item.value / 100
								})
							);
							break;
						case "lightness":
							filters.push(
								new fabric.Image.filters.ColorMatrix({
									matrix: [
										1 + (item.value / 100) * 0.5,
										0,
										0,
										0,
										0,
										0,
										1 + (item.value / 100) * 0.5,
										0,
										0,
										0,
										0,
										0,
										1 + (item.value / 100) * 0.5,
										0,
										0,
										0,
										0,
										0,
										1,
										0
									]
								}) //颜色矩阵
							);
							break;
						case "contrast":
							filters.push(
								new fabric.Image.filters.Contrast({
									contrast: (item.value / 100) * 0.5
								})
							);
							break;
						case "hue":
							filters.push(
								new fabric.Image.filters.HueRotation({
									rotation: item.value / 100
								})
							);
							break;
						case "saturation":
							filters.push(
								new fabric.Image.filters.Saturation({
									saturation: item.value / 100
								})
							);
							break;
						case "blur":
							filters.push(new fabric.Image.filters.Blur({ blur: Math.abs(item.value / 100) }));
							break;
						case "tone":
							filters.push(
								new fabric.Image.filters.ColorMatrix({
									matrix: [
										1,
										0,
										0,
										0,
										0, // 红色不变
										0,
										1 - (item.value / 100) * 0.5,
										0,
										0,
										0, // 调节绿色
										0,
										0,
										1,
										0,
										0, // 蓝色不变
										0,
										0,
										0,
										1,
										0 // 透明度不变
									]
								})
							);
							break;
						case "opacity":
							img.set("opacity", item.value / 100);
							break;
					}
				});

				// 设置滤镜并应用
				img.filters = filters;
				img.applyFilters();

				// 创建一个 canvas 元素，将处理后的图片绘制到 canvas 上
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (ctx) {
					canvas.width = img.width!;
					canvas.height = img.height!;
					ctx.globalAlpha = img.opacity!;
					ctx.drawImage(img.getElement() as HTMLImageElement, 0, 0);

					// 生成 base64 数据
					const dataUrl = canvas.toDataURL("image/png");
					callback(dataUrl);
				}
			},
			{ crossOrigin: "anonymous" } // 确保支持跨域图片
		);
	};

	function convertImageToBase64(url:string) {
		return new Promise((resolve, reject) => {
		  const img = new Image();
		  img.crossOrigin = 'Anonymous'; // 处理跨域问题 ‌:ml-citation{ref="1,6" data="citationList"}
		  img.onload = () => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;
			ctx?.drawImage(img, 0, 0); // 绘制图片到Canvas ‌:ml-citation{ref="1,5" data="citationList"}
			const base64 = canvas.toDataURL('image/jpeg'); // 生成Base64 ‌:ml-citation{ref="2,6" data="citationList"}
			resolve(base64);
		  };
		  img.onerror = reject;
		  img.src = url; // 设置图片路径 ‌:ml-citation{ref="1,6" data="citationList"}
		});
	  }


	return {
		brightnessData,
		changeImgBrightness,
		convertImageToBase64
	};
};
