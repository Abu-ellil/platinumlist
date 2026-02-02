<template>
	<teleport to="body" v-if="open">
		<div :class="{
				[$style.overlay] : true,
				[$style.overlayVisible] : isVisible,
			 }
		">
			<div :class="{
					[$style.galleryContainer] : true,
					[$style.galleryContainerVisible] : isVisible,
				 }"
			>
				<NoMobile>
					<div :class="$style.imageContainer">
						<img :class="{
								[$style.image] : true,
								[$style.imageVisible] : isImageVisible,
							 }"
							 :src="fullImagePath"
							 alt="Full Image"
						>
					</div>
				</NoMobile>
				<Mobile>
					<div @touchstart="handleTouchStart"
						 @touchmove="handleTouchMove"
						 @touchend="handleTouchEnd"
					>
						<img :class="{
								[$style.image] : true,
								[$style.imageVisible] : isImageVisible,
								[$style.imageSwipeRight] : directionFadeIn === 'right',
								[$style.imageSwipeLeft] : directionFadeIn === 'left'
							 }"
							 :style="{transform: `translateX(${dragOffset}px)`}"
							 :src="fullImagePath" alt="Full Image"
						/>
					</div>
				</Mobile>
				<div :class="$style.imageCounter">
					<span>
						{{ currentImageIndex + 1 }} / {{ galleryImageList.length }}
					</span>
				</div>
			</div>
			<button :class="$style.closeButton"
					type="button"
					@click="close"
			>
				<SvgIcon icon="24-kit-cross" />
			</button>
			<NoMobile>
				<template v-if="!hasSingleImage">
					<button :class="$style.buttonSlideLeft"
							type="button"
							@click="prev"
					>
						<SvgIcon icon="24-kit-arrowhead-left" />
					</button>
					<button :class="$style.buttonSlideRight"
							type="button"
							@click="next"
					>
						<SvgIcon icon="24-kit-arrowhead-right" />
					</button>
				</template>
			</NoMobile>
		</div>
	</teleport>
</template>

<script setup>

import { onBeforeMount, watch, ref, defineProps, defineEmits } from 'vue';
import Mobile from '@vue/mobile';
import NoMobile from '@vue/no-mobile';
import SvgIcon from '@vue/svg-icon';
import { useGallery } from '@vue/ticket-office/casual/composable/useGallery';

const SWIPE_THRESHOLD = 100;
const ANIMATION_DURATION_IMAGE_SWIPE = 300;
const ANIMATION_DURATION_IMAGE_LOAD = 150;

const props = defineProps([
	'open',
	'galleryImageList',
	'imageIndex',
]);

const emit = defineEmits([
	'close',
	'setImageIndex',
]);

const {
	setImageList,
	setCurrentImageIndex,
	currentImageIndex,
	hasSingleImage,
	prevImage,
	nextImage,
	fullImagePath,
} = useGallery();

const isVisible = ref(false);
const isImageVisible = ref(false);
const directionFadeIn = ref(null),
	  dragOffset = ref(0),
	  startX = ref(0);

const close = () => {
	emit('close');
	isImageVisible.value = false;
	isVisible.value = false;
};

const handleTouchStart = (event) => {
	startX.value = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
	if (startX.value === null) return;
	dragOffset.value = event.touches[0].clientX - startX.value;
};

const prev = () => {
	prevImage();
	emit('setImageIndex', currentImageIndex.value);
}

const next = () => {
	nextImage();
	emit('setImageIndex', currentImageIndex.value);
}

const handleTouchEnd = () => {
	if (Math.abs(dragOffset.value) > SWIPE_THRESHOLD) {
		if (dragOffset.value < 0) {
			directionFadeIn.value = 'right';
			next();
		} else {
			directionFadeIn.value = 'left';
			prev();
		}
	}
	resetTouchValues();
};

const resetTouchValues = () => {
	dragOffset.value = 0;
	startX.value = 0;
	setTimeout(() => directionFadeIn.value = null, ANIMATION_DURATION_IMAGE_SWIPE);
}

onBeforeMount(() => {
	setImageList(props.galleryImageList);
});

watch(() => props.open, (isOpen) => {
	if (isOpen) {
		setCurrentImageIndex(props.imageIndex);
		isVisible.value = true;
		setTimeout(() => isImageVisible.value = true, ANIMATION_DURATION_IMAGE_LOAD);
	}
});

</script>

<style lang="scss" module>

@import 'public/scss/globals/variables';

.imageSwipeRight {
	@keyframes image-fade-in-right {
		0% {
			opacity: 0;
			transform: translateX(100%);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}
	animation: image-fade-in-right 0.3s;
}

.imageSwipeLeft {
	@keyframes image-fade-in-left {
		0% {
			opacity: 0;
			transform: translateX(-100%);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}
	animation: image-fade-in-left 0.3s;
}

.overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
	background: rgba(0, 0, 0, 0.80);
	backdrop-filter: blur(3px);
	z-index: 5001;
	opacity: 0;
	transition: opacity 300ms ease-in-out;
}

.overlayVisible {
	opacity: 1;
}

.galleryContainer {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	opacity: 0;
	transition: opacity 200ms ease-in-out;
}

.galleryContainerVisible {
	opacity: 1;
}

.image {
	object-fit: cover;
	-webkit-user-drag: none;
	opacity: 0;
	transition: opacity 300ms ease-in-out;

	@media (min-width: $media-md) {
		max-height: calc(100% - 64px);
	}
}

.imageVisible {
	opacity: 1;
}

.imageCounter {
	position: absolute;
	border-radius: 24px;
	background: var(--Bg-fade);
	text-align: center;
	padding: 12px;
	top: 16px;

	:global(.is_ltr) & {
		left: 16px;
	}

	:global(.is_rtl) & {
		right: 16px;
	}

	@media (min-width: $media-sm) {
		top: 58px;

		:global(.is_ltr) & {
			left: inherit;
		}

		:global(.is_rtl) & {
			right: inherit;
		}
	}

	span {
		display: block;
		font-size: 16px;
		font-weight: 500;
		line-height: 20px;
		color: var(--Interaction-Primary-content);
		min-width: 38px;
	}
}

.imageContainer {
	@media(min-width: $media-md) {
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
		padding: 0 32px 0 32px;
	}
}

.closeButton {
	position: absolute;
	top: 16px;
	background: var(--Bg-fade);
	border-radius: 28px;
	padding: 10px;
	z-index: 5002;
	transition: 160ms;
	opacity: 0.8;
	@media(min-width: $media-sm) {
		top: 52px;
		padding: 16px;
	}

	&:hover {
		opacity: 1;
	}

	:global(.icon) {
		display: block;
		width: 24px;
		height: 24px;
		fill: var(--Interaction-Primary-content);
	}

	:global(.is_ltr) & {
		right: 16px;
		@media (min-width: $media-sm) {
			right: 52px;
		}
	}

	:global(.is_rtl) & {
		left: 16px;
		@media (min-width: $media-sm) {
			left: 52px;
		}
	}
}

.buttonSlide {
	position: absolute;
	top: calc(50% - 28px);
	border-radius: 28px;
	background: var(--Bg-fade);
	padding: 16px;
	transition: 160ms;
	opacity: 0.8;

	&:hover {
		opacity: 1;
	}

	:global(.icon) {
		display: block;
		fill: var(--Interaction-Primary-content);
		width: 24px;
		height: 24px;
	}
}

.buttonSlideLeft {
	@extend .buttonSlide;

	:global(.is_ltr) & {
		@media (min-width: $media-sm) {
			left: 52px;
		}

		@media (min-width: $media-md) {
			left: 174px;
		}

		@media (min-width: $media-lg) {
			left: 200px;
		}
	}

	:global(.is_rtl) & {
		@media (min-width: $media-sm) {
			right: 52px;
		}

		@media (min-width: $media-md) {
			right: 174px;
		}

		@media (min-width: $media-lg) {
			right: 200px;
		}

		:global(.icon) {
			transform: rotate(180deg);
		}
	}
}

.buttonSlideRight {
	@extend .buttonSlide;

	:global(.is_ltr) & {
		@media (min-width: $media-sm) {
			right: 52px;
		}

		@media (min-width: $media-md) {
			right: 174px;
		}

		@media (min-width: $media-lg) {
			right: 200px;
		}
	}

	:global(.is_rtl) & {
		@media (min-width: $media-sm) {
			left: 52px;
		}

		@media (min-width: $media-md) {
			left: 174px;
		}

		@media (min-width: $media-lg) {
			left: 200px;
		}

		:global(.icon) {
			transform: rotate(180deg);
		}
	}
}

</style>
