<template>
	<div :class="$style.gallery" v-if="galleryImageList && galleryImageList.length > 0">
		<NoMobile>
			<div :class="$style.imageContainer">
				<img :class="$style.image"
					 :src="fullImagePath"
					 alt="Full Image"
					 @click="openFullImage(currentImageIndex)"
				>
				<template v-if="!hasSingleImage">
					<button :class="$style.buttonSlideLeft"
							type="button"
							@click="prevImage"
					>
						<SvgIcon icon="16-kit-arrow-left"/>
					</button>
					<button :class="$style.buttonSlideRight"
							type="button"
							@click="nextImage"
					>
						<SvgIcon icon="16-kit-arrow-right"/>
					</button>
				</template>
			</div>
			<ul :class="$style.thumbImageSelector"
				 v-if="galleryImageList && galleryImageList.length > 1"
				 ref="imageSelectorContainerRef"
				 @mousedown="startScroll"
				 @mousemove="scroll"
				 @mouseup="endScroll"
				 @mouseleave="endScroll"
				 @wheel="wheelScroll"
			>
				<li v-for="(path, index) in galleryImageList"
					:key="index"
					@click="setCurrentImageIndex(index)"
					:class="{
						[$style.thumbImageContainer] : true,
						[$style.thumbImageActive] : index === currentImageIndex
					}"
				>
					<img :class="$style.thumbImage"
						 :src="path.thumb"
						 alt="Thumb image"
						 ref="imageThumbRef"
					>
				</li>
			</ul>
		</NoMobile>
		<Mobile>
			<div :class="$style.imageContainer"
				 ref="imageSelectorContainerMobileRef"
			>
				<img :class="{
						[$style.image] : true,
						[$style.imageFull] : hasSingleImage
					 }"
					 v-for="(path, index) in galleryImageList"
					 :key="index"
					 :src="path.full"
					 alt="Full Image"
					 ref="imageThumbRef"
					 @click="openFullImage(index)"
				>
			</div>
		</Mobile>
	</div>
</template>

<script setup>

import { ref, nextTick, onBeforeMount, onMounted, defineProps, defineEmits } from 'vue';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import SvgIcon from '@vue/svg-icon';
import { useGallery } from '@vue/ticket-office/casual/composable/useGallery';

const props = defineProps([
	'galleryImageList',
	'imageIndex',
]);

const emit = defineEmits([
	'openGallery'
]);

const {
	imageSelectorContainerRef,
	imageSelectorContainerMobileRef,
	imageThumbRef,
	setImageList,
	setCurrentImageIndex,
	scrollToImage,
	currentImageIndex,
	hasSingleImage,
	prevImage,
	nextImage,
	fullImagePath,
} = useGallery();

const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const openFullImage = (index) => {
	if (isDragging.value) return;
	setCurrentImageIndex(index);
	emit('openGallery', index);
};

const startScroll = (event) => {
	isDragging.value = true;
	startX.value = event.pageX - imageSelectorContainerRef.value.offsetLeft;
	scrollLeft.value = imageSelectorContainerRef.value.scrollLeft;
};

const scroll = (event) => {
	if (!isDragging.value) return;
	event.preventDefault();
	const x = event.pageX - imageSelectorContainerRef.value.offsetLeft;
	imageSelectorContainerRef.value.scrollLeft = scrollLeft.value - (x - startX.value);
};

const endScroll = () => {
	isDragging.value = false;
};

const wheelScroll = (event) => {
	event.preventDefault();
	let delta = event.deltaY;
	imageSelectorContainerRef.value.scrollLeft += delta;
};

onBeforeMount(() => {
	setImageList(props.galleryImageList);
	setCurrentImageIndex(props.imageIndex);
});

onMounted(() => {
	setCurrentImageIndex(props.imageIndex);
	nextTick(() => {
		scrollToImage();
	})
})

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.gallery {
	@media(min-width: $media-sm) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}
}

.imageContainer {
	display: flex;
	width: 100%;
	gap: 8px;
	flex-direction: row;
	overflow-x: auto;
	position: relative;
	@media (min-width: $media-sm) {
		overflow-x: unset;
		border-radius: 8px;
	}

	&::-webkit-scrollbar {
		display: none;
	}
}

.image {
	width: 298px;
	height: 264px;
	border-radius: 12px;
	object-fit: cover;
	-webkit-user-drag: none;
	flex: 0 0 auto;
	cursor: pointer;
	@media(min-width: $media-sm) {
		width: 100%;
		border-radius: 8px;
	}
}

.imageFull {
	@extend .image;
	width: 100%;
}

.buttonSlide {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 116px;
	border-radius: 16px;
	z-index: 0;
	background: var(--Bg-default);
	box-shadow: 0 0 2px 0 rgba(96, 128, 159, 0.08), 0 4px 12px 0 rgba(96, 128, 159, 0.12);
	padding: 8px;

	:global(.icon) {
		display: block;
		width: 16px;
		height: 16px;
		fill: var(--Content-primary);
	}

	&:hover {
		:global(.icon) {
			fill: var(--Interaction-Primary-bg_hover);
		}
	}
}

.buttonSlideLeft {
	@extend .buttonSlide;

	:global(.is_ltr) & {
		left: -16px;
	}

	:global(.is_rtl) & {
		right: -16px;

		:global(.icon) {
			transform: rotate(180deg);
		}
	}
}

.buttonSlideRight {
	@extend .buttonSlide;

	:global(.is_ltr) & {
		right: -16px;
	}

	:global(.is_rtl) & {
		left: -16px;

		:global(.icon) {
			transform: rotate(180deg);
		}
	}
}

.thumbImageSelector {
	display: flex;
	gap: 4px;
	overflow-x: auto;
	-webkit-user-drag: none;
	user-select: none;
	@keyframes thumb-image-selector-bottom-swipe {
		0% {
			opacity: 0;
			transform: translateY(25%);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	animation: thumb-image-selector-bottom-swipe 0.5s;

	&::-webkit-scrollbar {
		display: none;
	}
}

.thumbImageContainer {
	width: 56px;
	height: 56px;
	flex: 0 0 auto;
}

.thumbImage {
	width: 56px;
	height: 56px;
	object-fit: cover;
	border-radius: 8px;
	cursor: pointer;
	-webkit-user-drag: none;
	user-select: none;
}

.thumbImageActive {
	position: relative;

	&:after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 56px;
		height: 56px;
		box-sizing: border-box;
		border-radius: 8px;
		border: 2px solid var(--Interaction-Secondary-border);
	}
}

</style>